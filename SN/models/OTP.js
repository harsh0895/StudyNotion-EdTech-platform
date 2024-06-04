const mongoose = require("mongoose");
const mailSender = require('../utils/mailSender');
const otpTemplate = require('../mailTemplates/emailVerificationTemplate');

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    },
}, { versionKey: false });


// send OTp pre middleware 
async function sendEmailVerification(email, otp){
    try {

        const mailResponse = await mailSender(email, 'Verification email from StudyNoton', otpTemplate(otp));
        console.log('Email send Successfully!', mailResponse);
        
    } catch (error) {
        console.log('error occurred while sending a mail: ', error);
        throw error;
    }
}

OTPSchema.pre('save', async (next) => {
    
    // Assuming sendEmailVerification function returns a promise
    try {
        await sendEmailVerification(this.email, this.otp);
        next(); // Proceed to save the document
    } catch (error) {
        // Handle error if sending email verification fails
        next(error);
    }
})



const OTP = mongoose.model('OTP', OTPSchema);
module.exports = {
    OTP,
    sendEmailVerification
}