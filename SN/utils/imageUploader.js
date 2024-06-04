const cloudinary = require('cloudinary').v2

const imageUploadCloundinary = async ( file, folder, height, quality ) => {

     // Upload the image on cloudinary
     const options = {folder};
    
     // if quality exists then image quality would be reduced!
     if( height ){
         options.quality = quality;
     }

     if( quality){
         options.quality = quality;
     }
 
     options.resource_type = "auto"
     return await cloudinary.uploader.upload(file.tempFilePath, options); // ye vo temprary folder hai jo hmare server pr bnta hai cloudinary pr file ko upload krne ke liye
}

module.exports = imageUploadCloundinary;