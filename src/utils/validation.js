const validator = require("validator");
const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid")
    } else if(firstName?.length < 4 || firstName?.length > 50) {
        throw new Error("First Name should be 4 to 50 characters")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email ID is not valid")
    } else if(!validator.isStrongPassword(password)) {
        throw new Error("Weak password! Please enter a secure password")
    }
}

const validateEditProfileData = (req) => {
  const allowedEditFields = ["gender", "age", "about", "skills"];
    const isIncluded = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return !isIncluded
};

module.exports = {
    validateSignUpData,
    validateEditProfileData
}