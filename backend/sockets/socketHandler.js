export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected to socket:", socket.id);

    socket.on("setup", (userData) => {
   
      socket.join(userData._id);
      console.log(`User joined personal room: ${userData._id}`);
      socket.emit("connected");
    });

  
    socket.on("join_department", (department) => {
      socket.join(department);
      console.log(`Admin joined department room: ${department}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected from socket");
    });
  });
};