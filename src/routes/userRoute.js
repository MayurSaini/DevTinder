const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();

// get all the pending connection request
userRouter.get('/user/request/:status', userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const { status } = req.params;
		const connectionRequests = await ConnectionRequest.find({
			toUserId: loggedInUser._id,
			status: status
		}).populate("fromUserId", ["firstName", "lastName"])
		return res.status(201).json({
			message: "connection request fetched successfully",
			data: connectionRequests
		})
	} catch (error) {
		return res.status(400).send("ERROR" + error.message)
	}
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		console.log("Logged-in user:", loggedInUser.firstName);

		console.log("Logged-in user ID:", loggedInUser._id);
		const myConnections = await ConnectionRequest.find({
			status: "accepted",
			$or: [
				{ fromUserId: loggedInUser?._id },
				{ toUserId: loggedInUser?._id }
			]
		}).populate("fromUserId", "firstName lastName gender age")
			.populate("toUserId", "firstName lastName gender age")

		const data = myConnections.map((connection) => {
			const fromId = connection.fromUserId._id.toString();
			const loggedInId = req.user._id.toString();

			if (fromId === loggedInId) {
				return connection.toUserId;
			} else {
				return connection.fromUserId;
			}
		});
		return res.status(200).json({
			message: "Connection fetched successfully",
			data: data
		})
	} catch (error) {
		return res.status(400).send("ERROR" + error.message)
	}
})

userRouter.get('/feed', userAuth, async (req, res) => {
	try {
		const page = req.query.page || 1;
		let limit = req.query.limit || 10;
		limit = limit > 50 ? 50 : limit;
		const skip = (page - 1) * limit;
		const loggedInUser = req.user;
		const connectionRequests = await ConnectionRequest.find({
			$or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
		}).select('fromUserId toUserId')
		// .populate("toUserId", "lastName")
		// .populate("fromUserId", "firstName")

		const hideUsersFromFeed = new Set();
		connectionRequests.forEach((req) => {
			hideUsersFromFeed.add(req.fromUserId.toString());
			hideUsersFromFeed.add(req.toUserId.toString())
		})
		console.log("hideUsersFromFeed=======>", hideUsersFromFeed);
		const users = await User.find({
			$and: [
				{ _id: { $nin: Array.from(hideUsersFromFeed) } },
				{ _id: { $ne: loggedInUser._id } }
			]
		}).select("firstName lastName skills about emailId photoUrl gender age").skip(skip).limit(limit)
		console.log("users are-=-=--=-=-=->", users);

		res.send(users)
	} catch (error) {
		res.status(400).json({
			message: error.message
		})
	}
})

module.exports = userRouter