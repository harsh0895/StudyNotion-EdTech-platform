const SubSection = require("../../models/subSection");
const Section = require("../../models/Section");
const imageUploadCloundinary = require("../../utils/imageUploader");

require("dotenv").config();

// CREATE A SUBSECTION
/*
    1. Fetch data from the body
    2. extract file video
    3. check input validation
    4. upload video to cloudinary
    5. after uploading will take url
    6. create a subSection
    7. after creating a sub section we will insert in the Section Schema to the created subSection
    8. return response!
*/
const createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files.video;

    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(403).json({
        success: false,
        msg: "All fields are required while creating a subSection...",
      });
    }

    const uploadvideo = await imageUploadCloundinary(
      video,
      process.env.FOLDER_NAME
    );

    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadvideo.duration}`,
      description: description,
      videoUrl: uploadvideo.secure_url,
    });

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    console.log("Updated Section details: ", updatedSection);

    res.status(200).json({
      success: true,
      Subsection: SubSectionDetails,
      msg: "subSection created successfully...",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Error while creating a subsSection: ${error}`,
    });
  }
};

// update subsection
const updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    console.log("updated section", updatedSection);

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Error while updating a subsSection: ${error}`,
    });
  }
};

// delete subsection
const deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: `Error while deleting a subsSection: ${error}`,
    });
  }
};

module.exports = {
  createSubSection,
  updateSubSection,
  deleteSubSection,
};
