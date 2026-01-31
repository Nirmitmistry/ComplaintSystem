import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String,  required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Student", "Admin", "SuperAdmin"], default: 'Student' },
    studentdetails: {rollnumber: String, hostel:  String , roomnumber:  String },
    admindepartment: { type: String,enum: ['Hostel', 'Mess', 'Academic', 'Internet / Network', 'Infrastructure', 'Others'], }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;