import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const buildUniqueUsername = async (baseValue) => {
  const baseUsername = baseValue.replace(/\s+/g, '').toLowerCase() || 'user';
  let uniqueUsername = baseUsername;
  let counter = 1;

  while (await UserModel.findOne({ username: uniqueUsername })) {
    uniqueUsername = `${baseUsername}${counter}`;
    counter++;
  }

  return uniqueUsername;
};

export const googleAuth = async (req, res) => {
  try {
    const { credential, access_token } = req.body;
    let payload;

    if (credential) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else if (access_token) {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      payload = await response.json();
      if (payload.error) {
        return res.status(400).json({ error: 'Invalid Google access token' });
      }
    } else {
      return res.status(400).json({ error: 'Google credential missing' });
    }

    const { email, name, picture, sub } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Google account email missing' });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      const displayName = name?.trim() || email.split('@')[0];
      const uniqueUsername = await buildUniqueUsername(displayName);

      user = new UserModel({
        username: uniqueUsername,
        email,
        profilePic: picture,
        providers: [{ name: 'google', providerId: sub }]
      });
      await user.save();
    } else {
      user.providers = user.providers || [];
      const hasGoogle = user.providers.some(p => p.name === 'google');
      if (!hasGoogle) {
        user.providers.push({ name: 'google', providerId: sub });
        if (!user.profilePic) user.profilePic = picture;
        await user.save();
      }
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.status(200).json({
      message: 'Google Login successful',
      payload: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    console.error('Error in Google Auth:', error);
    res.status(500).json({ error: 'Google Authentication Failed' });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
   //validate input
   if (!username || !email || !password) {
     return res.status(400).json({ error: 'All fields are required' });
   }
  //check if user already exists
   const existingUser = await UserModel.findOne({$or: [{ email },{ username }]});
   if (existingUser) {
     return res.status(409).json({ error: 'User already exists' });
   }
  //hashing password
  const hashedPassword = await bcrypt.hash(password, 10);
  //creating user
  const newUser = new UserModel({ username, email, password: hashedPassword ,providers:[{name:"local"}]});
    await newUser.save();
  //generate jwt token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    //send cookie
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' });
    res.status(201).json({ message: 'User registered successfully', payload: { username: newUser.username, id: newUser._id, email: newUser.email } });
} catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }

};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // 2. Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.password) {
      return res.status(400).json({
      message: "Use Google login"
    });
  }
    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // 4. Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    // 5. Send cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    // 6. Response
    res.status(200).json({
      message: 'Login successful',
      payload: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.status(200).json({ message: 'Logout successful' });
};

export const githubAuth = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'GitHub code missing' });
    }

    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description || 'GitHub OAuth failed' });
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch user profile from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUser = await userResponse.json();

    // 3. Fetch user emails from GitHub (since email might be private)
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubEmails = await emailsResponse.json();
    const primaryEmailObj = githubEmails.find(email => email.primary) || githubEmails[0];
    
    if (!primaryEmailObj) {
      return res.status(400).json({ error: 'No email associated with GitHub account' });
    }

    const email = primaryEmailObj.email;
    const name = githubUser.name || githubUser.login || email.split('@')[0];
    const picture = githubUser.avatar_url;
    const sub = githubUser.id.toString();

    // 4. Create or update user in database
    let user = await UserModel.findOne({ email });

    if (!user) {
      let baseUsername = name.replace(/\s+/g, '').toLowerCase();
      let uniqueUsername = baseUsername;
      let counter = 1;
      
      while (await UserModel.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${baseUsername}${counter}`;
        counter++;
      }

      user = new UserModel({
        username: uniqueUsername,
        email,
        profilePic: picture,
        providers: [{ name: 'github', providerId: sub }]
      });
      await user.save();
    } else {
      user.providers = user.providers || [];
      const hasGithub = user.providers.some(p => p.name === 'github');
      if (!hasGithub) {
        user.providers.push({ name: 'github', providerId: sub });
        if (!user.profilePic) user.profilePic = picture;
        await user.save();
      }
    }

    // 5. Generate token and set cookie
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.status(200).json({
      message: 'GitHub Login successful',
      payload: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    console.error('Error in GitHub Auth:', error);
    res.status(500).json({ error: 'GitHub Authentication Failed' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'Access granted',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};