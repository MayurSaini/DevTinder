const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        paymentId: {
            type: String,
            unique: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: "INR",
        },
        status: {
            type: String,
            // enum: ["created", "paid", "failed"],
            // default: "created",
            required: true,
        },
        notes: {
            type: Map,
            of: String,
            default: {},
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
