const express = require('express');
const { validateSignUpData } = require("../utils/validation")
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const User = require("../models/user")

authRouter.post("/signup", async (req, res) => {
  console.log(req.body)
  try {
    // validation of data
    validateSignUpData(req)
    // Encrypt the password
    const {firstName, lastName, emailId, gender, age, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10 )

    //Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      gender,
      age,
      password: passwordHash
    })

    await user.save()
    res.send("User added successfully")
  } catch (error) {
    res.status(400).send("Error saving user:" + error.message)
  }

})

authRouter.post("/login", async (req, res) => {
  try {
    const {emailId,password} = req.body;
    const user = await User.findOne({emailId: emailId}) 
    console.log("user is", user.password)
    if(!user) {
      throw new Error("Email ID doesn't exist.")
    }
    const isPasswordValid = await user.validatePassword(password)
    console.log("isPasswordValid", isPasswordValid)
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000 )
      })
      res.send(user)
    } else {
      throw new Error("Invalid password")
    }
  } catch (error) {
    res.status(400).send("Error saving user:" + error.message)

  }
})

authRouter.post("/logout", async(req, res) => {

    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logout Successfull")
})
module.exports = authRouter