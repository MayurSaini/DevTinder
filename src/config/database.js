const mongoose = require("mongoose");
const connectDB = async () => {      
    const uri = process.env.DB_CONNECTION_STRING
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
};

module.exports = connectDB;