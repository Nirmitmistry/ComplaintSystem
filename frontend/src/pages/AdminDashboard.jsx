import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";
import { useAppContext } from "../context/AuthContext";
import ComplaintCard from "../components/ComplaintCard";

const AdminDashboard = () => {
  const { socket } = useSocketContext();
  const { user } = useAppContext();
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get("/complaints/");
      if (data.success) setComplaints(data.complaints);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for new complaints filed in this Admin's category
      socket.on("complaint_received", (newComplaint) => {
        if (newComplaint.category === user.admindepartment) {
          setComplaints((prev) => [newComplaint, ...prev]);
          toast(`New ${newComplaint.category} request!`);
        }
      });

      // Listen for status updates (e.g., if a SuperAdmin updates something)
      socket.on("complaint_updated", (updated) => {
        setComplaints((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      });
    }
    return () => {
      socket?.off("complaint_received");
      socket?.off("complaint_updated");
    };
  }, [socket, user]);

  // Filter logic based on your schema statuses
  const claimedComplaints = complaints.filter(c => c.status === 'In Progress' && c.claimedBy?._id === user._id);
  const pendingRequests = complaints.filter(c => c.status === 'Pending');

  return (
    <div className="max-w-5xl mx-auto p-6 pt-28 space-y-12">
      
      {/* SECTION 1: CLAIMED COMPLAINTS (Tasks assigned to you) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-800">Claimed Complaints</h2>
          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold">
            {claimedComplaints.length}
          </span>
        </div>
        
        <div className="grid gap-4">
          {claimedComplaints.length > 0 ? (
            claimedComplaints.map((item) => (
              <ComplaintCard key={item._id} data={item} role="Admin" refresh={fetchComplaints} />
            ))
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400">
              No active tasks. Claim a request below to get started.
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* SECTION 2: PENDING REQUESTS (Unclaimed tickets in your department) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-yellow-400 rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-800">Pending Requests</h2>
          <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded text-xs font-bold">
            {pendingRequests.length}
          </span>
        </div>

        <div className="grid gap-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((item) => (
              <ComplaintCard key={item._id} data={item} role="Admin" refresh={fetchComplaints} />
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 italic">
              All caught up! No pending requests in {user.admindepartment}.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;