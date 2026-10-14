const mongoose = require("mongoose");
const connectDB = async () => {  
    const uri = "mongodb+srv://mayurkasherwalmk_db_user:DevTinder1234@devtinder.gyubyaw.mongodb.net/?appName=DevTinder";
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
};

module.exports = connectDB;