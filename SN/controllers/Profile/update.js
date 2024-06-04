const Profile = require('../../models/Profile')
const User = require('../../models/User')

// update a profile
const updateProfile = async (req, res) => {
    try {

        const {
            dateOfBirth = "",
            about = "",
            contactNumber = "",
            gender = "",
          } = req.body
          const id = req.user.id
      
          // Find the profile by id
          const userDetails = await User.findById(id)

          if( !userDetails ) {
            return res.status(404).json({
                success: false,
                msg: "User Not Found!"
            })
          }

          const profile = await Profile.findById(userDetails.additionalDetails)
           // Update the profile fields
            profile.dateOfBirth = dateOfBirth
            profile.about = about
            profile.contactNumber = contactNumber
            profile.gender = gender

            await profile.save();

            return res.status(200).json({
                success: true,
                msg: 'Profile updated successfully!',
                profileDetails: profile
            })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: `Error while updating a profile: ${error}`
        })
    }
}


module.exports = updateProfile