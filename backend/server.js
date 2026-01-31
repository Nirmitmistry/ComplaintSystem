import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import connectDB from './configuration/db.js';

import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import { socketHandler } from './sockets/socketHandler.js';
import startCronJobs from './jobs/Scheduler.js';

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

await connectDB();

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/auth',authRoutes);
app.use('/api/complaints', complaintRoutes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

socketHandler(io);
startCronJobs();