import cron from "node-cron";
import Complaint from "./models/Complaint.js"; 

const startCronJobs = () => {
  cron.schedule('*/1 * * * *', async () => {
    console.log(' Checking for ignored complaints...');

    try {
      const timeThreshold = new Date(Date.now() - 2 * 60 * 1000); 
      const ignoredComplaints = await Complaint.find({
        status: "Pending",
        createdAt: { $lt: timeThreshold },
        priority: { $ne: "High" } 
      });

      if (ignoredComplaints.length > 0) {
        const idsToUpdate = ignoredComplaints.map(c => c._id);
        await Complaint.updateMany(
          { _id: { $in: idsToUpdate } },
          { 
            $set: { priority: "High", isEscalated: true }
          }
        );

        console.log(` Escalated ${ignoredComplaints.length} complaints to High Priority!`);
      } else {
        console.log(" No complaints need escalation.");
      }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
  });
};

export default startCronJobs;