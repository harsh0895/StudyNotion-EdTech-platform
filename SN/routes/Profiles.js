const express = require('express')
const profileRoutes = express.Router();

const { verifyToken } = require('../middlewares/auth')
const updateDisplayPicture = require('../controllers/Profile/updatePicture')
const updateProfile = require('../controllers/Profile/update')
const getAlluserDetails = require('../controllers/Profile/getAlluserDetails')
const deleteProfile = require('../controllers/Profile/deleteAcc')

profileRoutes.put('/updateDisplayPicture', verifyToken, updateDisplayPicture)
profileRoutes.put('/updateProfile', verifyToken, updateProfile)
profileRoutes.get('/alluserDetails', verifyToken, getAlluserDetails)
profileRoutes.delete('/deleteProfile', verifyToken, deleteProfile)


module.exports = profileRoutes