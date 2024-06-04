const User = require('../../models/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


// USER LOGIN
/*
    0. Before signup function check we will verify input field of login body from the verifyLoginBody() middleware !!
    1. fetch the data from the body
    2. after that check kro user already exists or not 
    3. user user not exists go to signUp and create your account
    4. if exists then we will compare the password with hashed password
    5. after that if password is correct then will generate a token for user login 
    6. then we will create a cookie
    7. user login successfully...
*/


const userLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        // validate 
        if( !email || !password ) {
            return res.status(403).json({
                success: false,
                msg: "All fields required while login user..."
            })
        }

        // check user already exisgts or not
        const checkUser = await User.findOne({email});
        if( !checkUser) {
            return res.status(404).json({
                success: false,
                msg: "User doesn't exists! Go to SignUp!"
            })
        }

        // if user exists
        const checkPassword = bcrypt.compareSync(password, checkUser.password);
        if( !checkPassword ){
            return res.status(401).json({
                success: false,
                msg: "Invalid Password, Error while comparing the password..."
            })
        }
        
        // user body
        const payload = {
            id: checkUser._id,
            firstName: checkUser.firstName,
            email: checkUser.email,
            accountType: checkUser.accountType,
        }

        // generate token
        const token = jwt.sign(payload, "secret", {expiresIn: '2h'} )
        checkUser.token = token
        checkUser.password = undefined

        const options = {
            expiresIn: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.cookie("token", token, options).status(200).json({
            success: true,
            userToken: token,
            checkUser,
            msg: "token generated successfully and you are logged in.."
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            msg: `Error while generated token or user Login ${error}`
        })
    }
}

module.exports = userLogin