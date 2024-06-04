const User = require('../../models/User');
const { OTP } = require('../../models/OTP')
const Profile = require('../../models/Profile')
const bcrypt = require('bcrypt')


// USER SIGN-UP
/*
    0. Before signup function check we will verify input field of signup body from the verifySignupBody() middleware !!
    1. Firstly we will fetch the data to the user input field and check the passwords are same ot not 
    2. check the user already exists or not 
    3. if user already exists then we will return and go to login
    4. otherwise we will create a new user 
    5. we will call to the sendOTP funtion for sending otp on our email and if the otp would be correct  
    5. then we will convert user password into hashed password using bcrypt library
    6. after converting the password into hash 
    7. then we will create an entry to the user into database if the otp would be correct !!
*/

const userSignup = async (req, res) => {
    try {

        const {
            firstName, lastName, email, password, confirmPassword,
            accountType, otp } = req.body;

        //validate
        if( !firstName || !lastName || !email || !password || !confirmPassword || !otp ){
        return res.status(403).json({
            success:false,
            message:"All fields are required",
            })   
        }

        // match both passowrd
        if( password !== confirmPassword ){
            res.status(400).json({
                success: false,
                msg: 'password and confirm password is not same pls check!'
            })
        }
        

        //check user already exist or not
        const existingUser = await User.findOne({email});

        if(existingUser){
        return res.status(400).json({
            success:false,
            message:'User is already registered',
            });
        }

        // check for admin is already exists or not 

        // if( check ) {
        //     return res.status(403).json({
        //         success: false,
        //         msg: 'Admin is already exists you cannot make your account type as an Admin...'
        //     })
        // }


        //find most recent otp stored for the user
        //created at -1 means sort in descending order
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        // console.log(recentOtp);
  
        //validate otp
        if( recentOtp.length === 0 ){
        return res.status(400).json({
            success:false,
            message:"OTP not found",
            });
        }
        else if(otp !== recentOtp[0].otp){
        return res.status(400).json({
            success:false,
            message:"Invalid OTP",
            });
        }

        // convert password into Hash password
        let hashedPassword;
        try {
            
            hashedPassword = await bcrypt.hash(password, 10);
            // console.log('Hashed Password: ', hashedPassword)

        } catch (error) {
            res.status(500).json({
                success: false,
                msg: `Error while converting a password into hashed password: ${error}`
            })
        }

        // create a dummy profile for editional data in Profile schema
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // entry create in db
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        }, )

        res.status(200).json({
            success: true,
            user: user,
            msg: "User Registered Successfully!"
        })
        
    } catch (error) {
        res.status(404).json({
            success: false,
            msg: `Error while signUp to the User pls try again: ${error}`
        })
    }
}

module.exports = userSignup