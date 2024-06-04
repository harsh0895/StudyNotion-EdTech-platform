const User = require('../../models/User')
const imageUploadCloundinary = require('../../utils/imageUploader')
const dotenv = require('dotenv')

dotenv.config();

const updateDisplayPicture = async (req, res) => {
    try {
        
    const displayPicture = req.files.displayPicture
    const userId = req.user.id

    const image = await imageUploadCloundinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log('image url: ',image)

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })


    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: `Error while updating the profile picture: ${error}`
        })
    }
}

module.exports = updateDisplayPicture