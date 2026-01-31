import axios from "axios";
import { toast } from "react-hot-toast";

const ComplaintCard = ({ data, role, refresh }) => {
  
  const handleAction = async (actionType) => {
    try {
      const endpoint = actionType === 'claim' ? "/complaints/claim" : "/complaints/update-status";
      const body = { 
        complaintId: data._id, 
        status: actionType === 'resolve' ? 'Resolved' : undefined 
      };

      const { data: res } = await axios.post(endpoint, body);
      
      if (res.success) {
        toast.success(res.message);
        if (refresh) refresh(); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <div className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between transition-all duration-200 ${
      data.isEscalated ? 'bg-red-50/30 border-red-100 shadow-red-50' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
           {data?.category?.charAt(0).toUpperCase() || "U"}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{data.category}</h4>
            
            {/* ESCALATION BADGE */}
            {data.isEscalated && (
              <span className="flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase animate-pulse">
                <span className="w-1 h-1 bg-white rounded-full"></span>
                Escalated
              </span>
            )}
          </div>

          <h3 className="font-bold text-gray-800 text-lg leading-tight">{data.title}</h3>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400 font-medium">Status:</span>
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              data.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 
              data.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
            }`}>
              {data.status}
            </span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${getPriorityStyle(data.priority)}`}>
              {data.priority}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {role === "Admin" ? (
          <div className="flex gap-2">
            {data.status === 'Pending' && (
              <button 
                onClick={() => handleAction('claim')}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-sm"
              >
                Claim
              </button>
            )}
            {data.status === 'In Progress' && (
              <button 
                onClick={() => handleAction('resolve')}
                className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-black transition shadow-sm"
              >
                Resolve
              </button>
            )}
          </div>
        ) : (
          <div className="text-right border-l border-gray-100 pl-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Filed On</p>
            <p className="font-bold text-gray-800 text-sm">
              {new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;