import { useAppContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAppContext();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

 

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-full flex justify-between items-center py-3 px-0">
        
        <div className="flex items-center">
    
          <div className="ml-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800 leading-tight">{user?.name}</span>
              <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
                {user?.role === 'Student' ? user?.studentdetails?.hostel : user?.admindepartment}
              </span>
            </div>
              <div className="h-8 w-1px bg-gray-100 mx-2 hidden sm:block opacity-50"></div>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-600 border border-blue-100 uppercase">
              {user?.role}
            </span>
          </div>

    
        </div>


        <div className="flex items-center gap-6">
          <button 
            onClick={handleLogout}
            className="bg-red-400 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition"
          >
            Logout
          </button>

          <h1 className="text-lg font-black text-gray-800 tracking-tighter border-l border-gray-200 pl-6 pr-4 hidden lg:block">
            SMART<span className="text-blue-600">COMPLAINT</span>
          </h1>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;