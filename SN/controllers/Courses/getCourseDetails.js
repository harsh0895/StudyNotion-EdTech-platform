const Course = require("../../models/Course")

const courseDetails = async (req, res) => {
    try {

         //get id
         const{ courseId } = req.body;
         //get course details
         const courseDetails = await Course.find(
                                      {_id:courseId})
                                      .populate({
                                         path:"instructor",
                                         populate:{
                                             path:"additionalDetails",
                                         },
                                      })
                                      .populate("category")
                                    //   .populate("ratingAndReviews")
                                      .populate({
                                         path:"courseContent",
                                        //  populate:{
                                        //      path:"subSection",
                                        //  },
                                      })
                                      .exec();
         //validation
         if(!courseDetails){
             return res.status(400).json({
                 success:false,
                 message:`Could not find the course with ${courseId}`,
             });
         }

         //return response
         return res.status(200).json({
             success:true,
             message:"Course details fetched successfully",
             data:courseDetails,
         })                            
 
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: `Course details Not Found: ${error}`
        })
    }
}

module.exports = courseDetails