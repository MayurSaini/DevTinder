const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const {subDays, startOfDay, endOfDay} = require("date-fns")
const sendEmail = require("./sendEmail");
// this job will run at 8 AM in the morning
cron.schedule("0 8 * * *", async () => {
    console.log("Hello world"+ new Date());
    try {
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);
        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))]
         for(const email of listOfEmails) {
            try {
                // send emails
            const res = await sendEmail.run("Hola! New Friend Request Pending for " + email, "There are so many friend Request pending, Please login to the portal and accept or reject the requests")
            } catch (error) {
                
            }

        }
    } catch (error) {
        
    }
})