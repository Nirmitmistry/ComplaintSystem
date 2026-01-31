import mongoose from "mongoose";


const ComplaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: {  type: String,  required: true  },
    category: {   type: String, enum: ['Hostel', 'Mess', 'Academic', 'Internet / Network', 'Infrastructure', 'Others'], required: true },
    priority: {  type: String,  enum: ['Low', 'High', 'Critical'], default: 'Low'  },
    status: {  type: String,  enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],  default: 'Pending'  },
    raisedBy: {  type: mongoose.Schema.Types.ObjectId,  ref: 'User',  required: true   },
    claimedBy: {  type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null  },
    isEscalated: {  type: Boolean,  default: false },
    logs: [
        {
            action: { type: String },
            performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            timestamp: { type: Date, default: Date.now },
            remarks: { type: String }
        }
    ]
},{ timestamps: true }     
)

const Complaint = mongoose.model('Complaint', ComplaintSchema)

export default Complaint