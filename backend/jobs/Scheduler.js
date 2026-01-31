import cron from "node-cron";
import Complaint from "../models/Complaint.js";


const startCronJobs = () => {

  cron.schedule('*/1 * * * *', async () => {
    console.log('Time-Based Intelligence Checks ');

    try {
      const now = new Date();
      const thirtyMinThreshold = new Date(now - 30 * 60 * 1000); 
      const twentyFourHourThreshold = new Date(now - 24 * 60 * 60 * 1000);
      const priorityUpdate = await Complaint.updateMany(
        {
          status: "Pending", 
          createdAt: { $lt: thirtyMinThreshold },
          priority: { $ne: "High" }
        },
        { 
          $set: { priority: "High" },
          $push: { history: { action: "Auto-escalated priority due to inactivity", timestamp: now } } 
        }
      );

      if (priorityUpdate.modifiedCount > 0) {
        console.log(`Priority increased for ${priorityUpdate.modifiedCount} complaints.`);
      }
      const adminEscalation = await Complaint.updateMany(
        {
          status: { $in: ["Pending", "In Progress"] }, 
          createdAt: { $lt: twentyFourHourThreshold },
          isEscalated: { $ne: true } 
        },
        { 
          $set: { isEscalated: true },
          $push: { history: { action: "Escalated to Super Admin ", timestamp: now } }
        }
      );

      if (adminEscalation.modifiedCount > 0) {
        console.log(` Escalated ${adminEscalation.modifiedCount} complaints to Super Admin.`);
      }

    } catch (error) {
      console.error("Cron Job Execution Error:", error.message);
    }
  });
};

export default startCronJobs;