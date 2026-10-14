const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the user's collection
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignore", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`
            }
        }
    },
    {
        timestamps: true
    }
)

// compound indexing to optimise query
connectionRequestSchema.index({fromUserId: 1, toUserId: 1})

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You can not send request to yourself");
        
    }
})

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports = ConnectionRequestModel;