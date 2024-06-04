const Category = require('../../models/category');


// CREATE A CATEGORY
/*
    1. fetch the data from the req.body
    2. input Body check
    3. create entry in db
 */
const createCategory = async (req, res) => {
    try {

        const { name, description } = req.body;

        if( !name || !description ) {
            return res.status(411).json({
                success: false,
                msg: "All fields are required in input body for creating a caregory!"
            })
        }

        // create entry in db

        const category = await Category.create({ name, description });
        
        res.status(200).json({
            success: true,
            tag: category,
            msg: "Category created Successfully..."
        })

        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: `Error while creating a Tag: ${error}`
        })
    }
}

module.exports = createCategory