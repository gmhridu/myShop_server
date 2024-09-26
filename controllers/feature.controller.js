const Feature = require("../models/features.model");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    const featuresImages = new Feature({
      image,
    });

    const savedImage = await featuresImages.save();

    res.status(201).json({
      success: true,
      message: "Feature image added successfully",
      data: savedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error adding feature image",
    });
  }
};

const getFeatureImage = async (req, res) => {
  try {
    const images = await Feature.find({});

    if (!images)
      return res
        .status(404)
        .json({ success: false, message: "No images found" });
    
    res.status(200).json({
      success: true,
      message: "Feature images retrieved successfully",
      data: images,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error adding feature image",
    });
  }
};

module.exports = {
  addFeatureImage,
  getFeatureImage,
};
