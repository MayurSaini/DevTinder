const express = require('express');
const { userAuth } = require('../middleware/auth');
const { validateEditProfileData } = require('../utils/validation');
const User = require('../models/user');

const profileRouter = express.Router();

profileRouter.get("/profile/view/:requestId", userAuth, async (req, res) => {
  try {
    const {requestId} = req.params;
    const fetchedUser = await User.findById(requestId)
    res.send(fetchedUser);
  } catch (error) {
    res.status(400).send("Error saving user:" + error.message)

  }
})


profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  console.log(!validateEditProfileData(req),"edit request body is-==-=-=->", req.body)
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
            
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
        await loggedInUser.save();
        res.send(`${loggedInUser.firstName} your profile has been updated successfully`)
    } catch (error) {
        res.status(400).send("ERROR" + error.message)
    }
})

module.exports = profileRouter