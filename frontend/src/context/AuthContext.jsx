import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; 


axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  

  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false); 

  const [complaints, setComplaints] = useState([]); 


  const setRoles = (userRole) => {
    setIsAdmin(userRole === 'admin');
    setIsSuperAdmin(userRole === 'superadmin');
    setIsStudent(userRole === 'student');  role
  };

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get('/auth/data'); 
      
      if (data.success) {
        setUser(data.user);
        setRoles(data.user.role); 
      } else {
        logout();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        
        setUser(data.user);
        setRoles(data.user.role);
        
        toast.success("Login Successful!");
        
        if (data.user.role === 'superadmin') navigate('/super-admin-dashboard');
        else if (data.user.role === 'admin') navigate('/admin-dashboard');
        else navigate('/student-dashboard');
        
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    setIsSuperAdmin(false);
    setIsStudent(false);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/'); 
    toast.success('Logged out');
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const value = {
    axios,
    navigate,
    
    
    token, setToken,
    user, setUser, 
    
    isAdmin,
    isSuperAdmin,
    isStudent,

    login,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};