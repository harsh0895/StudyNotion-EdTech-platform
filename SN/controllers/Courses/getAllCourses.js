const Course = require("../../models/Course");

// get all courses
const showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();
      console.log(allCourses)


    return res.status(200).json({
      success: true,
      message: "Data for all Courses fetched successfully",
      data: allCourses,
    })

  } catch (error) {
    return res.status(404).json({
      success: false,
      msg: `Error while showing all Course: ${error}`,
    });
  }
}

module.exports = showAllCourses;
