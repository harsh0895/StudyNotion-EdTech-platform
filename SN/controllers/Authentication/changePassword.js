const User = require('../../models/User')
const mailSender = require('../../utils/mailSender')
const bcrypt = require('bcrypt')
const { passwordUpdated } = require('../../mailTemplates/passwordUpdate')
const crypto = require("crypto");   



// CHANGE PASSWORD
/*
    0. first we will check the body of user input field and call changePassword !!
    1. get data from the req.body
    2. get oldPassword, newPass, confirmPassword
    3. validation
    4. update the password in user database
    5. send mail for password updated
    6. return response !!
*/


const changePassword = async (req, res) => {
    try {

         //get data form req body
         const userDetails = await User.findById(req.user.id);

         //get old password,new password,confirmNewPassword
         const { oldPassword, newPassword, confirmNewPassword } = req.body;

         //validate old password
         const isPasswordMatch = await bcrypt.compare(
             oldPassword,
             userDetails.password
         );

         if(!isPasswordMatch){
             //if password is not matched return a unauthorized error 401
             return res.status(401).json({
                 success:false,
                 message: "The password is incorrect",
             });
         }

         // Match new password and confirm new password
         if (newPassword !== confirmNewPassword) {
             // If new password and confirm new password do not match, return a 400 (Bad Request) error
             return res.status(400).json({
                 success: false,
                 message: "The password and confirm password does not match",
             });
         }

         //update password in DB
         const encryptedPassword = await bcrypt.hash(newPassword, 10);
         const updatedUserDetails = await User.findByIdAndUpdate(
             req.user.id,
             { password: encryptedPassword },
             { new: true }
         );

         //send mail
         try {
             const emailResponse = await mailSender(
                 updatedUserDetails.email,
                 passwordUpdated(
                     updatedUserDetails.email,
                     `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                 )
             );
             console.log("Email sent successfully:", emailResponse.response);
         } catch (error) {
             // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
             console.error("Error occurred while sending email:", error);
             return res.status(500).json({
                 success: false,
                 message: "Error occurred while sending email",
                 error: error.message,
             });
         }
         
        //return response
        return res.status(200).json({
         success:true,
         message: "Password updated successfully",
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            msg: `Error while reset the password to the user: ${error}`
        })
    }
}

// resetPassword token
/*
    1. get email from req.body
    2. check user present for this email
    3. validation
    4. generate the token 
    5. update user by adding token and espiration time
    6. create url for password reset
    7. if url has created then send mail to user of success!
*/
const resetPasswordToken = async (req, res) => {
    
    try {

        const { email } = req.body;

        const user = await User.findOne({email});

        if( !user ){
            return res.status(403).json({
                success: false,
                msg: "Your email is not registered!"
            })
        }
        
        // if user exists then generate the token
        const token = crypto.randomUUID();
        console.log(token);

        // update user by adding token and espiration time
        const updatedDetails = await User.findOneAndUpdate({email: email}, {
                                                            token: token,
                                                            resetPasswordExpires: Date.now() + 5 * 60 * 1000 }, 
                                                            {new: true }); // it tells the new updated document 
        
        console.log('Updated details: ',updatedDetails);


        // create link for password reset
        const url = `http://localhost:3000/update-password/${token}`;
            
        // send mail

        await mailSender(email, "Password reset link", `Password reset link: ${url}`);

        // after sending the mail
        return res.status(200).json({
            success: true,
            msg: "Email sent Successfully, pls check email and reset your password!!"
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            msg: `Error while reset the password token to the user: ${error}`
        })      
    }
}


// reset password
/*
    1. fetch data
    2. validation
    3. get userDetails from db using token
    4. if no entry - means token is invalid
    5. token time check
    6. hash new password
    7. password update
    8. return response
*/
const resetPassword = async(req, res) => {
    try {

        const { password, confirmPassword, token } = req.body; // is token ko body ke ander frontend dalenga

        //validation
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:'Passwords are not matching',
            });
        }

        //get userdetails from db using token
        const userDetails =await User.findOne({token:token});

        //if no entry -->> invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:'Token is invalid',
            });
        }

        // token time check
        if( userDetails.resetPasswordExpires < Date.now() ) {
            return res.status(403).json({
                success: false,
                msg: "Token is expired, pls re-generate token!"
            })
        }

        //hash password
        const hashedPassword =await bcrypt.hash(password,10);
        //update password
        const newBody = await User.findOneAndUpdate(
                   {token:token},
                   {password:hashedPassword},
                   {new:true},
        );

        console.log(`after update the password: ${newBody}`);

        //return response
        return res.status(200).json({
            success:true,
            message:'Password reset successfull',
        });
        
    } catch (error) {
        return res.status(403).json({
            success: false,
            msg: `Error while reset password sending link to the user email: ${error}`
        })
    }
}


module.exports = {
    changePassword,
    resetPasswordToken,
    resetPassword
}