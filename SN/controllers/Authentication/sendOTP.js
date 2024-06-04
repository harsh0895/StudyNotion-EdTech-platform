const User = require('../../models/User')
const {OTP, sendEmailVerification} = require('../../models/OTP');
const otpGenerator = require('otp-generator');


// SEND OTP
/*
    1. fetch email from the req.body
    2. then we will check the given email or user already exists or not 
    3. if the user is not exists then we will return and go to login
    4. if user doesnot exits then will send the otp to the given email 
    5. after sending the email we will generate and store the unique otp in our database by using the otp-genrator npm package
    6. then after taking the otp by the client we will compare to the user otp or db otp for checking the user otp is correct or not!
    7. after the is the otp is correct then we can create a user to signup
*/


const sendOTP = async (req, res) => {
    try {

        const { email } = req.body;

        const checkUser = await User.findOne({email});

        if( checkUser ){
            return res.status(401).json({
                success: false,
                msg: "User already registered, you can't send the otp to existing user!"
            })
        }

        // is user not already exists then generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log('otp is: ', otp);

        // check opt is unique or not 
        let result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            }); 
            result = await OTP.findOne({otp: otp});
        }

        // store otp in db
        const StoreOTPinDB = await OTP.create({email, otp});
        console.log(StoreOTPinDB)

        await sendEmailVerification(email, otp);

        res.status(200).json({
            success: true,
            otp: otp,
            msg: "Otp sent successully..."
        })

        
    } catch (error) {
        res.status(404).json({
            success: false,
            msg: `Error while sending a otp: ${error}`
        })
    }
}

module.exports = sendOTP