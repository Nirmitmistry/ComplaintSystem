import express from 'express'; 
import { getComplaints,fileComplaint,claimComplaint,updateComplaintStatus,getComplaintDashboard } from '../controllers/complaintController.js';
import { protect } from '../middleware/auth.js';

const complaintRouter = express.Router();

complaintRouter.post('/file', protect, fileComplaint);
complaintRouter.get('/',protect, getComplaints);
complaintRouter.post('/claim',protect, claimComplaint);
complaintRouter.post('/update-status', protect, updateComplaintStatus);
complaintRouter.get('/dashboard', protect, getComplaintDashboard);

export default complaintRouter;


