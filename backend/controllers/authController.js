import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, studentdetails, admindepartment } = req.body;
        if (!name || !email || !password || !role || password.length < 8) {
            return res.status(400).json({ success: false, message: 'Fill all the required fields ' });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            role,
            studentdetails,   
            admindepartment  
        });
        const token = generateToken(user._id.toString(), user.role);
        
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email, 
            role: user.role,
            studentdetails: user.studentdetails, 
            admindepartment: user.admindepartment
        };

        res.status(201).json({ success: true, token, user: userResponse });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
       const { email, password } = req.body;
       const user = await User.findOne({ email });
       if (!user) {
           return res.status(400).json({ success: false, message: 'User not found' });
       }
       const isMatch = await bcrypt.compare(password, user.password);
       if (!isMatch) {
           return res.status(400).json({ success: false, message: 'Invalid credentials' });
       }
       const token = generateToken(user._id.toString(), user.role);
       const userResponse = {
           _id: user._id,
           name: user.name,
           email: user.email, 
           role: user.role,
           studentdetails: user.studentdetails,
           admindepartment: user.admindepartment
       };
       res.status(200).json({ success: true, token, user: userResponse });
    } catch (error) {
       console.log(error.message);
       res.status(500).json({ success: false, message: error.message });
    }
};