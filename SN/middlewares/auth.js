// const User = require('../../models/User')
const jwt = require('jsonwebtoken')


// verify token
const verifyToken = (req, res, next) => {

    try {

        const token = req.body.token || req.cookies.token || req.headers["x-access-token"];
        
        // const token = req.headers["x-access-token"]

        if( !token || token === undefined ) {
            return res.status(401).json({
                success: false,
                msg: "Token Missing..."
            })
        }

        // verify the token
        try {     
            let decode = jwt.verify(token, "secret");
            // console.log(decode)

            req.user = decode; //important

        } catch (error) {
            return res.status(401).json({
                success: false,
                msg: "token in invalid..."
            })
        }
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "Something went wrong, while verifying the token..."
        })
    }    
}

// isStudent
const isStudent = async(req, res, next) => {
    try {

        if( req.user.accountType != 'Student' ){
            res.status(404).json({
                success: false,
                msg: 'User is not a Student!'
            })
        }
        
        // is user isStudent then 
        next();
        
    } catch (error) {
        res.status(403).json({
            success: false,
            msg: 'Error while checking the User is a student or not!'
        })
    }
}


// isInstructor
const isInstructor = async(req, res, next) => {
    try {

        if( req.user.accountType != 'Instructor' ){
            res.status(404).json({
                success: false,
                msg: 'User is not a Instructor!'
            })
        }
        
        // is user isInstructor then 
        next();
        
        
    } catch (error) {
        res.status(403).json({
            success: false,
            msg: 'User is not a Instructor!'
        })
    }
}

// isAdmin
const isAdmin = async(req, res, next) => {
    try {

        if( req.user.accountType != 'Admin' ){
            res.status(404).json({
                success: false,
                msg: 'User is not a Admin!'
            })
        }
        
        // is user isAdmin then 
        next();
        
    } catch (error) {
        res.status(403).json({
            success: false,
            msg: 'User is not a Admin!'
        })
    }
}


module.exports = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isStudent: isStudent,
    isInstructor: isInstructor
}