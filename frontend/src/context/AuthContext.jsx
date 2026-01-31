import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; 

// Set Base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/";
axios.defaults.withCredentials = true;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Load user on startup if token exists
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get('/auth/data'); 
      if (data.success) setUser(data.user);
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    }
  };

  const handleAuthSuccess = (data) => {
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    // Note: Navigation is handled by the UI component (Login.jsx) or App.jsx logic
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      if (data.success) {
        handleAuthSuccess(data);
        toast.success("Login Successful!");
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await axios.post('/auth/register', formData);
      if (data.success) {
        handleAuthSuccess(data);
        toast.success("Registration Successful!");
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/'); 
    toast.success('Logged out');
  };

  return (
    <AppContext.Provider value={{ user, login, register, logout, token }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);