const RatingAndReview = require("../../models/RatingAndReview");
const Course = require("../../models/Course");

// create Rating
const createRating = async (req, res) => {
  try {
    //get user id
    const userId = req.user.id;

    //fetch data from req body
    const { rating, review, courseId } = req.body;

    //check if user is enrolled
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }

    //check user already reviewd course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }

    //create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    //update the course with rating
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    )

    //return response
    return res.status(200).json({
      success: true,
      message: "Rating and Review created Successfully",
      ratingReview,
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Error while creating Rating and Review: ${error}`,
    });
  }
}


module.exports = createRating