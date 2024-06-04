const User = require('../../models/User')

const getAlluserDetails = async (req, res) => {
    try {

    const id = req.user.id
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()
    console.log(userDetails)
    
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: `Error while fetching all user Details: ${error}`
        })
    }
}

module.exports = getAlluserDetails