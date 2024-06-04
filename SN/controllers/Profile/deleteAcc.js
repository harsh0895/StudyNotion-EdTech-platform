const Profile = require('../../models/Profile')
const User = require('../../models/User')
const mongoose = require('mongoose')

// delete Account
// get user id
// check validation
// delete profile in the user model which store editional data
// after that delete user

const deleteProfile = async (req, res) => {
    try {

        const id = req.user.id;

        const checkUser = await User.find({id});
        if( !checkUser ) {
            return res.status(404).json({
                success: false,
                msg: "User Not Found!"
            })
        }

    //       // Delete Assosiated Profile with the User
    // await Profile.findByIdAndDelete({
    //     _id: new mongoose.Types.ObjectId(user.additionalDetails),
    //   })
    //   for (const courseId of user.courses) {
    //     await Course.findByIdAndUpdate(
    //       courseId,
    //       { $pull: { studentsEnroled: id } },
    //       { new: true }
    //     )
    //   }

        await Profile.findByIdAndDelete({_id: new mongoose.Types.ObjectId(checkUser.additionalDetails)});
        await User.findByIdAndDelete({_id: id});
        
        res.status(200).json({
            success: true,
            msg: 'Account deleted Successfully...'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: `Error while deleting a user Account: ${error}`
        })
    }
}



module.exports = deleteProfile