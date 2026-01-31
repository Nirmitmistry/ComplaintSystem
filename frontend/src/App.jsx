import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AuthContext.jsx";


import Navbar from "./components/Navbar.jsx";
import Auth from "./components/Auth.jsx";

import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperadminDashboard";

function App() {
  const { user, token } = useAppContext();

  
  if (!token) {
    return (
      <>
        <Toaster position="top-right" />
        <Auth />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Toaster position="top-right" />
      
      <Navbar />    
      <main className="pt-6">
        {/* Simple Role-Based Routing */}
        {!user ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : user.role === "Admin" ? (
          <AdminDashboard />
        ) : user.role === "SuperAdmin" ? (
          <SuperAdminDashboard />
        ) : user.role === "Student" ? (
          <StudentDashboard />
        ) : null}
      </main>
    </div>
  );
}

export default App;