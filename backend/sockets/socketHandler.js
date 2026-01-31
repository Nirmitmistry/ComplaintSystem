
export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(" A user connected to socket:", socket.id);
    socket.on("setup", (userData) => {
     
      socket.join(userData._id);
      console.log(` User joined personal room: ${userData._id}`);

      socket.emit("connected");
    });

 
    socket.on("join_department", (department) => {

      socket.join(department);
      console.log(` Admin joined department room: ${department}`);
    });
    socket.on("new_complaint", (complaintData) => {
      const { category, raisedBy, title } = complaintData;

      if (!category) return console.log(" Complaint missing category");

      io.to(category).emit("complaint_received", complaintData);
      
      console.log(` New Complaint: "${title}" -> Sent to ${category} Dept`);
    });


    socket.on("update_status", (updatedComplaint) => {
      const studentId = updatedComplaint.raisedBy;
      
 
      const targetId = typeof studentId === 'object' ? studentId._id : studentId;

      if (!targetId) return console.log(" Cannot send update: No Student ID");

   
      io.to(targetId).emit("status_changed", updatedComplaint);
      
      console.log(`Status Update Sent to Student: ${targetId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected from socket");
  
    });
  });
};