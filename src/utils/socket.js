const socket = require('socket.io');
const { Chat } = require('../models/chat');
// const ConnectionRequest = require('../models/connectionRequest');



const initializeSocket = (server) => {
	const io = socket(server, {
		cors: {
			origin: [
				"http://localhost:5173",
				"http://www.twingle.live",
				"https://www.twingle.live"
			]
		}
	})

	io.on("connection", (socket) => {
		// Handle Events
		socket.on("joinChat", ({firstName, userId, targetUserId}) => {
			const roomId = [userId, targetUserId].sort().join("_");
			console.log(firstName+"Joined roomId-=-=-=-=-==->"+ roomId);
			
			socket.join(roomId);
		})

		socket.on("sendMessage", async ({firstName, userId, targetUserId, text}) => {
			const roomId = [userId, targetUserId].sort().join("_");
			console.log(firstName+ " " +text);
			// save message in db
			try {
				// ConnectionRequest.findOne({fromUserId: userId, toUserId: targetUserId, status})
				let chat = await Chat.findOne({participants: {$all: [userId, targetUserId]}})
				if (!chat) {
					chat = new Chat({
						participants: [userId, targetUserId],
						message: [],
					})
				}
				chat.messages.push({
					senderId: userId,
					text: text
				})
				await chat.save();
			} catch (error) {
				
			}
			io.to(roomId).emit("messageReceived", {firstName, text, timeStamp: new Date()})
		})

		socket.on("disconnect", (data) => {

		})

	})
}
module.exports = initializeSocket