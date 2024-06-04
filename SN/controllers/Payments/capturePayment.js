const { instance } = require("../../config/razorpay");
const Course = require("../../models/Course");
const User = require("../../models/User");
const mailSender = require("../../utils/mailSender");
const { courseEnrollmentEmail } = require("../../mailTemplates/courseEnrollment");
const mongoose = require("mongoose");

// cature payment
/* 
    1. get courseId and userId
    2. validation
    3. check courseId and userId
    4. check user already pay for the same course
    5. order create
    6. return response
*/

const capturePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const  userId  = req.user.id;

    // validation
    if (!courseId) {
      return res.json({
        success: false,
        msg: "please provide valid course Id...",
      });
    }

    // check course datils is valid or not
    let course;

    try {
      course = await Course.findById(courseId);
      if (!course) {
        return res.json({
          success: false,
          msg: "could not find the courseId in the course schema...",
        });
      }

      // check user already purchased it
      const uid = new mongoose.Types.ObjectId(userId);
        
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          msg: "Student is already enrolled! ",
        });
      }
    } catch (error) {
      res.status(403).json({
        success: false,
        msg: `Error while enrollment: ${error}`,
      });
    }

    // order create
    const amount = Course.price;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courseId: courseId,
        userId,
      },
    };

    console.log(`options: ${options}`);

    try {
      // intiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log("initiate payment ", paymentResponse);

      res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
        message: "Payment initiate Successfully...",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        mesage: `Could not Initiate Order: ${error}`,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Error while capturing the payment: ${error}`,
    });
  }
};




// verify signature
const verifySegnature = async (req, res) => {
  const webhookSecret = "12345678";

  // razorpay signature
  const signature = req.headers["x-razorpay-signature"];

  //converting webhook key to secret hash
  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment is Authorised");

    const { userId, courseId } = req.body.payload.payment.entity.notes;

    try {
      //find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not found",
        });
      }
        console.log(enrolledCourse);

      //find the student and add the course to their list of enrolle courses
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );
      console.log(enrolledStudent);

      //send course purchase mail
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations from Codehelp",
        "Congratulations, you are onboarded into new Codehelp Course "
      );
      console.log(emailResponse);

      // return response
      return res.status(200).json({
        success: true,
        message: "Signature verified and Course added",
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error while verifying the signature: ${error}`,
      });
    }

  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid request while verifying the signature...",
    });
  }
};



module.exports = {
  capturePayment,
  verifySegnature,
}