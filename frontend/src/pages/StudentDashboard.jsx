import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";
import ComplaintCard from "../components/ComplaintCard";
import { useAppContext } from "../context/AuthContext";

const StudentDashboard = () => {
  const { socket } = useSocketContext();
  const { user, token } = useAppContext();
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Hostel",
    priority: "Low"
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user || !token) return;
      try {
        const { data } = await axios.get("/complaints/");
        if (data.success) setComplaints(data.complaints);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchComplaints();
  }, [user, token]);

  useEffect(() => {
    if (socket) {
      socket.on("status_changed", (updatedComplaint) => {
        setComplaints((prev) =>
          prev.map((c) => (c._id === updatedComplaint._id ? updatedComplaint : c))
        );

        if (updatedComplaint.status === "In Progress") {
          toast.success(`Admin has claimed: ${updatedComplaint.title}`, {
            icon: "🛠️",
            duration: 4000
          });
        } else if (updatedComplaint.status === "Resolved") {
          toast.success(`Issue resolved: ${updatedComplaint.title}`, {
            icon: "✅",
            duration: 4000
          });
        }
      });
    }

    return () => {
      if (socket) socket.off("status_changed");
    };
  }, [socket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/complaints/file", formData);
      if (data.success) {
        toast.success("Complaint filed successfully!");
        setComplaints([data.complaint, ...complaints]);

        if (socket) {
          socket.emit("new_complaint_submitted", data.complaint);
        }

        setFormData({ title: "", description: "", category: "Hostel", priority: "Low" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to file complaint");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-28 space-y-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          <span className="text-blue-600">Raise</span> Complaint
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">Subject</label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. WiFi not working"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">Category</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="Hostel">Hostel</option>
              <option value="Mess">Mess</option>
              <option value="Academic">Academic</option>
              <option value="Internet / Network">Internet / Network</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">Priority</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">Message</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none h-24 transition"
              placeholder="Detailed description of the issue..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition">
            Submit New Complaint
          </button>
        </form>
      </div>

      <hr className="border-gray-100" />

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent History</h2>
        {complaints.length > 0 ? (
          complaints.map((item) => (
            <ComplaintCard key={item._id} data={item} />
          ))
        ) : (
          <p className="text-center text-gray-400 py-10">No complaints filed yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;