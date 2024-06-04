const mongoose = require('mongoose');

const dbConnect = () => {
    mongoose.connect('mongodb+srv://megaProject:MOmDulwkJaycaZHB@cluster0.tqsa6qo.mongodb.net/finalProject')
    .then(() => {
        console.log('database connected successfully...')
    })
    .catch((error) => {
        console.log("Failed to connect with database...");
        console.error(error);
        console.exit(1);
    })

}

module.exports = dbConnect