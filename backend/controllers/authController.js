import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
   //validate input
   if (!username || !email || !password) {
     return res.status(400).json({ error: 'All fields are required' });
   }
  //check if user already exists
   const existingUser = await UserModel.findOne({ email });
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