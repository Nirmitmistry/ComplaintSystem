import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configuration/db.js';

import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';



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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});