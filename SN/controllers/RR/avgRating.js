const RatingAndReview = require("../../models/RatingAndReview");
const { default: mongoose } = require("mongoose");


// avg Rating
const avgRating = async (req, res) => {
    try {

         //get courseId
         const courseId=req.body.courseId;
         //calculate average rating
 
         const result= await RatingAndReview.aggregate([
             {
                 $match:{
                     course:mongoose.Types.ObjectId(courseId),
                 },
             },
             {
                 $group:{
                     _id:null,
                     averageRating:{$avg:"$rating"},
                 }
             }
         ])

         //return rating
         if(result.length > 0){
             return res.status(200).json({
                 success: true,
                 averageRating: result[0].averageRating,
             })
         }
 
         //if no rating/review exist 
         return res.status(200).json({
             success:true,
             message:'Average rating is 0,no ratings given till now',
             averageRating: 0,
         })
        
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: `Error while calculating the avg Rating of the Course... ${error}`
        });
    }
}


// get all rating
const getAllRating = async (req, res) => {
    try {

        const allReviews = await RatingAndReview.find({})
        .sort({rating: "desc"})
        .populate({
          path: "user",
          select: "firstName lastName email image",
        })
        .populate({
          path: "course",
          select: "courseName",
        })
        .exec();

        return res.status(200).json({
            success:true,
            message: "All Reviews fetched Successfully",
            data: allReviews,
        })                       

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: `Error while calculating the All Rating of the Course... ${error}`
        });
    }
}



module.exports = {
    avgRating,
    getAllRating
}