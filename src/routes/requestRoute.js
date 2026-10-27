const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const requestRouter = express.Router();
const sendEmail = require("../utils/sendEmail")
requestRouter.post("/request/send/:status/:toUserId", 
	userAuth, async (req, res) => {
	try {
		const fromUserId = req.user._id;
		const toUserId = req.params.toUserId;
		const status = req.params.status;
		const allowedStatus = ['ignore', "interested"];
		if (!allowedStatus.includes(status)) {
			return res.status(400).json({
				message: "invalid status type"
			})
		}

		const toUser = await User.findById(toUserId);		
		if (!toUser) {
			return res.status(404).send({
				message: "User not found"
			})
		}
		// Already any connection request pending 		
		const existingConnectionRequest = await ConnectionRequest.findOne({
			$or: [
				{
					fromUserId,
					toUserId
				},
				{
					toUserId: fromUserId,
					fromUserId: toUserId
				}
			]
		})		
		if (existingConnectionRequest) {
			return res.status(400).send({
				message: "Connection Request already exists!"
			})
		}		
		const connectionRequest = new ConnectionRequest({
			fromUserId,
			toUserId,
			status
		})		
		const data = await connectionRequest.save();		
		const emailRes = await sendEmail.run("A new frined request from ", req.user.firstName + " is " + status + " in "  + toUser.firstName);		
		res.json({
			message: "Connection Request sent successfully",
			data
		})

	} catch (error) {
		res.status(400).json({
			message: error.message
		})
	}
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
	try {
		const loggedInUser = req.user;
		const allowedStatus = ["accepted", "rejected"];
		const {status, requestId} = req.params;
		if (!allowedStatus.includes(status)) {
			return res.status(400).json({
				message: "Status Not Allowed"
			})
		}
		const connectionRequest = await ConnectionRequest.findOne({
			_id: requestId,
			toUserId: loggedInUser._id,
			status: "interested"
		})
		
		if(!connectionRequest) {
			return res.status(404).json({
				message: "connection not found"
			})
		}

		connectionRequest.status = status
				console.log("connectionRequest-==-=--=-=-=>", connectionRequest);

		const data = await connectionRequest.save();

		return res.json({message: "Connection Request" + status , data})

	} catch (error) {
		res.status(400).json({
			message: error.message
		})
	}
})
module.exports = requestRouter