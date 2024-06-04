const express = require('express');
const { verifyToken, isStudent, isAdmin, isInstructor } = require('../middlewares/auth');
const userSignup = require('../controllers/Authentication/SignUp')
const userLogin = require('../controllers/Authentication/Login')
const sendOTP = require('../controllers/Authentication/sendOTP')
const { changePassword, resetPasswordToken, resetPassword } = require('../controllers/Authentication/changePassword')

const userRoutes = express.Router();


// USER CONTROLLERS IMPORT
userRoutes.post('/sendotp', sendOTP)
userRoutes.post('/signUp', userSignup)
userRoutes.post('/login', userLogin)

// Route for Changing the password
userRoutes.post('/changePassword', verifyToken, changePassword)

// route for reset the password token
userRoutes.post('/resetpassToken', resetPasswordToken)

// Route for resetting user's password after verification
userRoutes.post('/resetPassword', resetPassword)


module.exports = userRoutes;