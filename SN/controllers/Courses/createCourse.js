const Course = require('../../models/Course')
const Category = require('../../models/category')
const User = require('../../models/User')
const imageUploadCloundinary = require('../../utils/imageUploader');
const courseDetails = require('./getCourseDetails');

require('dotenv').config();

// creating a course
/*
    1. input validation
    2. fetching all course data from req.body
    3. check the user is Instructor or not 
    4. is instructor then we will check the Category 
    5. after that we will upload the image of thumbNail on cloudinary 
    6. then we create a course entry in db
    7. add course entry in user schema 
    8. add course entry in Category section
    9. return response 

*/
const createCourse = async (req, res) => {
    // try {
        
    //     const { courseName, courseDescription, whatYouWillLearn, price, tag, category } = req.body;

    //     // Convert the tag and instructions from stringified Array to Array
    //     // const tag = JSON.parse(tag)
        
    //     // get thumNail
    //     const thumbNail = req.files.thumbNail;

    //     // validation
    //     if( !courseName || !courseDescription || !whatYouWillLearn || !price || !tag ) {
    //         return res.status(403).json({
    //             success: false,
    //             msg: "All fields are required while creating a course..."
    //         })
    //     }

        
    //     // Check if the user is an instructor
    //     const userId = req.user.id;
    //     const instructorDetails = await User.findById(userId, {
    //         accountType: "Instructor",
    //     })

    //     if (!instructorDetails) {
    //         return res.status(404).json({
    //             success: false,
    //             message: "Instructor Details Not Found",
    //         })
    //     }

    //     console.log("Tag: ", tag)
    //     console.log(category)

    //     // Check if the given tag is valid
    //     const categoryDetails = await Category.findById(category)
    //     if (!categoryDetails) {
    //         return res.status(404).json({
    //             success: false,
    //             message: "Category Details Not Found",
    //         })
    //     }
    //     console.log("categoryDetails: ",categoryDetails)

    //     // upload image to cloudinary
    //     const image = await imageUploadCloundinary(thumbNail, process.env.FOLDER_NAME);

    //     // create an entry for new course
    //     const newCourse = await Course.create({
    //         courseName,
    //         courseDescription,
    //         instructor: instructorDetails._id,
    //         whatYouWillLearn,
    //         price,
    //         tag,
    //         category: categoryDetails._id,
    //         thumbnail: image.secure_url
    //     })
    //     console.log(newCourse);

    //     // Add the new course to the User Schema of the Instructor
    //     await User.findByIdAndUpdate(
    //         {
    //          _id: instructorDetails._id,
    //         },
    //         {
    //         $push: {
    //             courses: newCourse._id,
    //         },
    //         },
    //         { new: true }
    //     )

    //     // Add the new course to the Categories
    //     const categoryDetails2 = await Category.findByIdAndUpdate(
    //     tag,
    //     {
    //       $push: {
    //         courses: newCourse._id,
    //       },
    //     },
    //     { new: true }
    //   )
    //   console.log("HEREEEEEEEE", categoryDetails2)

    //   res.status(200).json({
    //     success: true,
    //     data: newCourse,
    //     message: "Course Created Successfully",
    //   })





    try {
        // Get user ID from request object
        const userId = req.user.id
    
        // Get all required fields from request body
        let {
          courseName,
          courseDescription,
          whatYouWillLearn,
          price,
          tag: _tag,
          category,
          status,
          instructions: _instructions,
        } = req.body
        // Get thumbnail image from request files
        const thumbNail = req.files.thumbNail;
    
        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)
    
        console.log("tag", tag)
        console.log("instructions", instructions)
    
        // Check if any of the required fields are missing
        // if (
        //   !courseName ||
        //   !courseDescription ||
        //   !whatYouWillLearn ||
        //   !price ||
        //   !tag.length ||
        //   !thumbnail ||
        //   !category ||
        //   !instructions.length
        // ) {
        //   return res.status(400).json({
        //     success: false,
        //     message: "All Fields are Mandatory",
        //   })
        // }

        // validation
        if( !courseName || !courseDescription || !whatYouWillLearn || !price || !tag ) {
            return res.status(403).json({
                success: false,
                msg: "All fields are required while creating a course..."
            })
        }

        if (!status || status === undefined) {
          status = "Draft"
        }
        // Check if the user is an instructor
        const instructorDetails = await User.findById(userId, {
          accountType: "Instructor",
        })
    
        if (!instructorDetails) {
          return res.status(404).json({
            success: false,
            message: "Instructor Details Not Found",
          })
        }
    
        // Check if the tag given is valid
        const categoryDetails = await Category.findById(category)
        if (!categoryDetails) {
          return res.status(404).json({
            success: false,
            message: "Category Details Not Found",
          })
        }
       

         // upload image to cloudinary
        const image = await imageUploadCloundinary(thumbNail, process.env.FOLDER_NAME);

        // Create a new course with the given details
        const newCourse = await Course.create({
          courseName,
          courseDescription,
          instructor: instructorDetails._id,
          whatYouWillLearn: whatYouWillLearn,
          price,
          tag,
          category: categoryDetails._id,
          thumbnail: image.secure_url,
          status: status,
          instructions,
        })
    
        // Add the new course to the User Schema of the Instructor
        await User.findByIdAndUpdate(
          {
            _id: instructorDetails._id,
          },
          {
            $push: {
              courses: newCourse._id,
            },
          },
          { new: true }
        )
        // Add the new course to the Categories
        const categoryDetails2 = await Category.findByIdAndUpdate(
          { _id: category },
          {
            $push: {
              courses: newCourse._id,
            },
          },
          { new: true }
        )
        console.log("HEREEEEEEEE", categoryDetails2)
        // Return the new course and a success message
        res.status(200).json({
          success: true,
          data: newCourse,
          message: "Course Created Successfully",
        })

    } catch (error) {
        return res.status(404).json({
            success: false,
            msg: `Error while creating a new Course: ${error}`
        })
    }
}

module.exports = createCourse