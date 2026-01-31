import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

export const fileComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const existingActiveComplaint = await Complaint.findOne({
        raisedBy: req.user._id,
        status: 'In Progress'
    });

    if (existingActiveComplaint) {
        return res.status(400).json({ 
            success: false, 
            message: "Cannot raise a new complaint while one is In Progress" 
        });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: 'Low',
      status: 'Pending',
      raisedBy: req.user._id,
      logs: [
        {
          action: 'Complaint Filed',
          performedBy: req.user._id,
          remarks: 'Initial complaint registration',
          timestamp: new Date()
        }
      ]
    });

    req.io.to(category).emit('complaint_received', complaint);

    res.status(201).json({ success: true, complaint });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getComplaints = async (req, res) => {
    try {
        const { _id, role, admindepartment } = req.user;
        let query = {};
        if (role === 'Student') {
            query = { raisedBy: _id };
        } else if (role === 'Admin') {
            query = { category: admindepartment }; 
        }
        const complaints = await Complaint.find(query)
            .populate('raisedBy', 'name email studentdetails')
            .populate('claimedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: complaints.length, complaints });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const claimComplaint = async (req, res) => {
    try {
        const { _id } = req.user;
        const { complaintId } = req.body; 
        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            return res.json({ success: false, message: "Complaint not found" });
        }

        if (complaint.claimedBy) {
            return res.json({ success: false, message: "Complaint already claimed" });
        }

        complaint.claimedBy = _id;
        complaint.status = 'In Progress';
        
        complaint.logs.push({
            action: 'Claimed',
            performedBy: _id,
            remarks: 'Admin took ownership'
        });

        await complaint.save();

        req.io.to(complaint.raisedBy.toString()).emit('status_changed', complaint);
        req.io.to(complaint.category).emit('complaint_updated', complaint);

        res.json({ success: true, message: "Complaint Claimed Successfully", complaint });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateComplaintStatus = async (req, res) => {
    try {
        const { _id, role } = req.user;
        const { complaintId, status, remarks } = req.body;

        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.json({ success: false, message: "Complaint not found" });
        }

        if (complaint.claimedBy?.toString() !== _id.toString() && role !== 'SuperAdmin') {
            return res.json({ success: false, message: "Unauthorized to update this complaint" });
        }

        complaint.status = status;

        complaint.logs.push({
            action: `Marked as ${status}`,
            performedBy: _id,
            remarks: remarks || 'Status updated'
        });

        await complaint.save();

        req.io.to(complaint.raisedBy.toString()).emit('status_changed', complaint);
        req.io.to(complaint.category).emit('complaint_updated', complaint);

        res.json({ success: true, message: `Complaint ${status}`, complaint });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getComplaintDashboard = async (req, res) => {
    try {
        const { _id, role, admindepartment } = req.user;
        let query = {};

        if (role === 'Student') {
            query = { raisedBy: _id };
        } else if (role === 'Admin') {
            query = { category: admindepartment };
        }
        const complaints = await Complaint.find(query);

        const pending = complaints.filter(c => c.status === 'Pending').length;
        const inProgress = complaints.filter(c => c.status === 'In Progress').length;
        const resolved = complaints.filter(c => c.status === 'Resolved').length;

        const dashboardData = {
            totalComplaints: complaints.length,
            pending,
            inProgress,
            resolved,
            recentComplaints: complaints.slice(0, 5) 
        };
        res.json({ success: true, dashboardData });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};