import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useSocketContext } from "../context/SocketContext";
import ComplaintCard from "../components/ComplaintCard";

const SuperAdminDashboard = () => {
  const { socket } = useSocketContext();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

  const fetchData = async () => {
    try {
      const { data } = await axios.get("/complaints/");
      if (data.success) {
        setComplaints(data.complaints);
        setStats({
          total: data.complaints.length,
          pending: data.complaints.filter(c => c.status === "Pending").length,
          resolved: data.complaints.filter(c => c.status === "Resolved").length
        });
      }
    } catch (err) { 
      console.error(err);
     }
  };

  useEffect(() => {
    fetchData();
    if (socket) {
      socket.on("status_changed", fetchData);
      socket.on("complaint_escalated", fetchData);
    }
    return () => { socket?.off("status_changed"); socket?.off("complaint_escalated"); };
  }, [socket]);

  const chartData = [
    { name: "Pending", value: stats.pending, color: "#F59E0B" },
    { name: "Resolved", value: stats.resolved, color: "#10B981" },
    { name: "Others", value: stats.total - (stats.pending + stats.resolved), color: "#3B82F6" }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 pt-28 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">System <span className="text-blue-600">Overview</span></h2>
          <div className="p-6 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
            <p className="text-sm font-bold uppercase opacity-80">Total Requests</p>
            <p className="text-4xl font-bold">{stats.total}</p>
          </div>
        </div>
        
        <div className="h-40 col-span-2 bg-white rounded-2xl border border-gray-100 flex items-center px-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} innerRadius={30} outerRadius={50} dataKey="value" paddingAngle={5}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 ml-4">
             {chartData.map(d => (
               <div key={d.name} className="flex items-center gap-2 text-xs font-bold">
                 <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}}></div>
                 {d.name}: {d.value}
               </div>
             ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Super Admin List</h3>
        <div className="grid gap-4">
          {complaints.map(item => (
            <ComplaintCard key={item._id} data={item} role="Admin" refresh={fetchData} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;