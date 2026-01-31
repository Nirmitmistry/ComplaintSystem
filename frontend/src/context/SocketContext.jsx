import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAppContext } from "./AppContext"; 

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, token } = useAppContext(); 

  useEffect(() => {
    if (user && token) {
      
      const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
        query: {
          userId: user._id, 
          role: user.role,  
        },
      });

      
      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });


      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user, token]); 

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};


export const useSocketContext = () => {
  return useContext(SocketContext);
};