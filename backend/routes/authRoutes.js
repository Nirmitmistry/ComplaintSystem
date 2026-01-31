import express from 'express';
import { registerUser, loginUser, getUserData } from '../controllers/authController.js';
import { auth } from '@clerk/nextjs/server';
import { protect } from '../middleware/authMiddleware.js';
const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/data', protect, getUserData)
export default authRouter;

