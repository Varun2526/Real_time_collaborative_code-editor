import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential missing' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload; 

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
        providers: [{ name: 'google', providerId: sub }]
      });
      await user.save();
    } else {
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
      sameSite: 'lax'
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
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
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
      sameSite: 'lax'
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
    sameSite: 'lax'
  });
  res.status(200).json({ message: 'Logout successful' });
};