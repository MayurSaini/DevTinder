const express = require('express');
const { userAuth } = require('../middleware/auth');

const paymentRouter = express.Router();
const rzpInstance = require('../utils/razorpay');
const Payment = require('../models/payments');
const { membershipAmount } = require('../utils/constants');
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const User = require('../models/user');

paymentRouter.post('/payment/create', userAuth, async (req, res) => {
    const {membershipType} = req.body;    
    const {firstName, lastName, emailId} = req?.user
    try {
        const options = {
            amount: membershipAmount[membershipType],  // Amount is in currency subunits. 
            currency: "INR",
            receipt: "order_rcptid_11",
            "notes": {
                 firstName,
                 lastName,
                membershipType,
                emailId
            }
        }        
        const createdOrder = await rzpInstance.orders.create(options);
        const obj ={
            userId: req.user._id,
            orderId: createdOrder.id,
            status: createdOrder.status,
            amount: createdOrder.amount,
            currency: createdOrder.currency,
            receipt: createdOrder.receipt,
            paymentId:  createdOrder.id,
            notes: createdOrder.notes,
        }
        const payment = new Payment(obj)        
        const savedPayment = await payment.save()        
        res.json({...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID})
    } catch (error) {
        console.error("Payment creation failed:", error);
    return res.status(500).json({ error: error.message });
    }
})

paymentRouter.post('/payment/webhook', async(req, res) => {
    try {
        const webhookSignature = req.headers["X-Razorpay-Signature"]
        const isWebhookValid= validateWebhookSignature(
        JSON.stringify(req.body), 
        webhookSignature, 
        process.env.RAZORPAY_WEBHOOK_SECRET
    )
    if (!isWebhookValid) {
        return res.status(400).json({msg: "Webhook signature is invalid"})
    }

    //Update payment status in DB
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await payment.findOne({orderId: paymentDetails.order_id})
    payment.status = paymentDetails.status;
    await payment.save();
    //Update the user as premium
    const user = await User.findOne({_id: payment.userId})
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType
    // if(req.body.event === "payment.captured") {

    // }

    // if(req.body.event === "payment.failed") {

    // }
    return res.status(200).json({msg: "webhook recieved successfully"})
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }


})

module.exports = paymentRouter