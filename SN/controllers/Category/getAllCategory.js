const Category = require('../../models/category')


// Taking all categories
const showAllCategories = async (req, res) => {
    try {

        const AllCategories = await Category.find({}, {name: true, description: true} );

        res.status(200).json({
            success: true,
            tags: AllCategories,
            msg: "These are all Categories in the database..."
        })
        
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: `Error while taking all categories: ${error}`
        })
    }
}

module.exports = showAllCategories