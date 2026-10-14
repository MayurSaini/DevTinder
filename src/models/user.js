const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
	firstName: {
		type: String,
		length: 100,
		required: true

	},
	lastName: {
		type: String,
		length: 100,
	},
	emailId: {
		type: String,
		minLength: 4,
		maxLength: 100,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("invalid email address")
			}
		}
	},
	password: {
		type: String,
		required: true,
		validate(value) {
			if (!validator.isStrongPassword(value)) {
				throw new Error("Please enter strong password")
			}
		}
	},
	age: {
		type: Number,
		length: 3
	},
	gender: {
		type: String,
		validate(value) {
			if (!['male', 'female', 'others'].includes(value)) {
				throw new Error("Gender data not valid")
			}
		}
	},
	photoUrl: {
		type: String,
		shortDesc: String,
		default: 'https://www.google.com/imgres?q=dummy%20user%20full%20photo%20image&imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F045%2F944%2F199%2Fnon_2x%2Fmale-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Fvector-art%2F45944199-male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration&docid=wUvKnkgBKWdrsM&tbnid=uh-gv_eguuNW4M&vet=12ahUKEwj47ZLY_-uWAxXUUWwGHRdYNjsQnPAOegQISBAA..i&w=980&h=980&hcb=2&ved=2ahUKEwj47ZLY_-uWAxXUUWwGHRdYNjsQnPAOegQISBAA',
		validate(value) {
			if (!validator.isURL(value)) {
				throw new Error("invalid URL address")
			}
		}

	},
	about: {
		type: String,
		default: "About of the user"
	},
	skills: {
		type: [String]
	}
}, { timestamps: true })

userSchema.methods.getJWT = async function () {
	const user = this
	const token = await jwt.sign({ _id: user._id }, "DEV@Tinder790", {
		expiresIn: "1d"
	})
	return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {	
	const user = this;	
	const passwordHash = user.password	
	const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)
	return isPasswordValid
}
const userModel = mongoose.model("User", userSchema)

module.exports = userModel