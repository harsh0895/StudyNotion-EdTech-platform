const Section = require('../../models/Section')
const Course = require('../../models/Course')

// CREATE A SECTION IN COURSE
/*
    1. fetch the data from the body
    2. check input validation for section
    3. after that we create a section
    4. after creating a section we will update the section in our course Schema
    5. return response!
*/

const createSection = async (req, res) => {
    try {
        
        const { sectionName, courseId } = req.body;

        // validation
        if( !sectionName || !courseId ) {
            return res.status(403).json({
                success: false,
                msg: "All field are required while creating a section of the Course..."
            })
        }

        // create entry in db
        const newSection = await Section.create({sectionName});

        // update the course schema 
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
              $push: {
                courseContent: newSection._id,
              },
            },
            { new: true }
          ).populate({
              path: "courseContent",
            //   populate: {
            //     path: "subSection",
            //   },
            })
            .exec()
            console.log('updated course ', updatedCourse)

            res.status(200).json({
                success: true,
                updatedCourse,
                msg: "Section created successfully..."
            })
    

    } catch (error) {
        res.status(500).json({
            success: false,
            meg: `Error while creating a Section! ${error}`
        })
    }
}




// UPDATE A SECTION
/*
    1. fetch the data from the body
    2. check input validation for section
    3. after that we update a section or course mei update krne ki jrurat nhi hai kyuki hum name update kr rhe hai section ki id nhi!
    4. return response!
*/

const updateSection = async (req, res) => {
    try {

        const { sectionName, sectionId } = req.body;
        const update = await Section.findByIdAndUpdate(sectionId, {sectionName: sectionName}, {new: true});

        if( !sectionName || !sectionId ) {
            res.status(403).send('All fields are required!');
        }

        res.status(200).json({
            success: true,
            section: update,
            msg: "Section Updated Successfully..."
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            meg: `Error while updating a Section! ${error}`
        })
    }
}




// DELETE A SECTION
/*
    1. fetch the section id from the params
    2. check input validation for section
    3. after that we delete a section and also will be deleted from the courseContent body!
    4. return response!
*/

const deleteSection = async (req, res) => {
    try {

        const { sectionId, courseId } = req.body
        await Course.findByIdAndUpdate(courseId, {
          $pull: {
            courseContent: sectionId,
          },
        })
        const section = await Section.findById(sectionId)
        console.log(sectionId, courseId)
        if (!section) {
          return res.status(404).json({
            success: false,
            message: "Section not found",
          })
        }
        // Delete the associated subsections
        // await SubSection.deleteMany({ _id: { $in: section.subSection } })
    
        await Section.findByIdAndDelete(sectionId)
    
        // find the updated course and return it
        const course = await Course.findById(courseId)
          .populate({
            path: "courseContent",
            // populate: {
            //   path: "subSection",
            // },
          })
          .exec()
    
        res.status(200).json({
          success: true,
          message: "Section deleted",
          data: course,
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            meg: `Error while deleting a Section! ${error}`
        })
    }
}


module.exports = {
    createSection,
    updateSection,
    deleteSection
}