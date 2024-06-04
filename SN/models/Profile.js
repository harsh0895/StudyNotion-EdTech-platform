const mongoose=require("mongoose");

const profileSchema=new mongoose.Schema({
    gender:{
        type:String,
    },
    dateOfBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
    },
    contactNumber:{
        type:String,
        trim:true,
    }
}, { timestamps: false, versionKey: false });

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile 