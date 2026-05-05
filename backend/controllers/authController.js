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


export const login = async(req,res)=>{

  try{
  const{email , password} = req.body

  if (!email || !password) {
     return res.status(400).json({ error: 'All fields are required' });
   }
   const hashedPassword1 = await bcrypt.hash(password, 10);

   const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    //send cookie
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    res.status(200).json({ message: 'Login successful', payload: { username: user.username, id: user._id, email: user.email } });
} catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
