const mongoose = require('mongoose');

const courseProgress = new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    completedVideos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }
    ]
}, { timestamps: false, versionKey: false });

const CourseProgress = mongoose.model('CourseProgress', courseProgress);
module.exports = CourseProgress;