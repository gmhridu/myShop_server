const Color = require("../models/color.model");

// Create Color
const createColor = async (req, res) => {
    try {
      const newColor = await Color.create(req.body);
      res.status(201).json(newColor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //   get all color
  const getAllColor = async (req, res) => {
    try {
      const colors = await Color.find();
      res.json(colors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //   get color by id
  const getColorById = async (req, res) => {
    try {
      const color = await Color.findById(req.params.id);
      if (!color) return res.status(404).json({ message: "Color not found" });
      res.json(color);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {createColor, getAllColor, getColorById};