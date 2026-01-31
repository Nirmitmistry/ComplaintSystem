import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import connectDB from './configuration/db.js';

import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import { socketHandler } from './sockets/socketHandler.js';
import startCronJobs from './jobs/Scheduler.js';

dotenv.config();

~
await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], 
    methods: ["GET", "POST"]
  }
});


app.use((req, res, next) => {
  req.io = io;
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);


startCronJobs();
socketHandler(io);

app.get('/', (req, res) => {
  res.send('Server is running');
});