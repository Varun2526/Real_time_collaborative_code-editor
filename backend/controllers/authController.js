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

