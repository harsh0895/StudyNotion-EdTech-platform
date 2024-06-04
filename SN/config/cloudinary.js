const cloudinary = require('cloudinary').v2;



const cloudniaryConnect = () => {
    try {

        // Configure Cloudinary with your API credentials
        cloudinary.config({
          cloud_name: 'dkcdebrlv',
          api_key: 594516232164695,
          api_secret: 'eLOTzjpSl7Q-6aBYoCHubKFfQy0'
        });

        console.log("cloudniary connected")
        
    } catch (error) {
        console.log(`Cloudinary connection error: ${error}`)        
    }
}

module.exports = cloudniaryConnect;