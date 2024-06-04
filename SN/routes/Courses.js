const express = require('express')
const courseRoutes = express.Router();

// Importing Middlewares
const { verifyToken, isAdmin, isInstructor, isStudent } = require('../middlewares/auth')

// Categories Controllers Import
const createCategory = require('../controllers/Category/createCategory')
const showAllCategories = require('../controllers/Category/getAllCategory')
const categoryPageDetails = require('../controllers/Category/categoryPageDetails')

// Courses Controllers Import
const createCourse = require('../controllers/Courses/createCourse')
const getAllCourses = require('../controllers/Courses/getAllCourses')
const getCoursesDetails = require('../controllers/Courses/getCourseDetails')

// Section Controllers Import
const { createSection, updateSection, deleteSection } = require('../controllers/Section/Section')

// Sub-Section Controllers Import
const {  createSubSection, updateSubSection, deleteSubSection } = require('../controllers/Section/SubSection');
// console.log(updateSubSection)


// CATEGORY ROUTES
courseRoutes.post('/createCategory', verifyToken, isAdmin, createCategory);
courseRoutes.get('/showAllCategories', showAllCategories);
courseRoutes.post('/getcategoryPageDetails', categoryPageDetails);


// COURSE ROUTES
courseRoutes.post('/createCourse', verifyToken, isInstructor, createCourse);
courseRoutes.post('/getCourseDetails', getCoursesDetails)
courseRoutes.get('/getAllCourses', getAllCourses)

// SECTION ROUTES
courseRoutes.post('/createSection', verifyToken, isInstructor, createSection);
courseRoutes.post('/updateSection', verifyToken, isInstructor, updateSection);
courseRoutes.post('/deleteSection', verifyToken, isInstructor, deleteSection);

// SUB-SECTION ROUTES
courseRoutes.post('/createSubSection', verifyToken, isInstructor, createSubSection)
courseRoutes.post('/updateSubSection', verifyToken, isInstructor, updateSubSection)
courseRoutes.post('/deleteSubSection', verifyToken, isInstructor, deleteSubSection)



module.exports = courseRoutes