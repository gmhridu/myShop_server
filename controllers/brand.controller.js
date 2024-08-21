const Brand = require("../models/brand.model");

// Create Brand
const createBrand = async (req, res) => {
    try {
      const newBrand = await Brand.create(req.body);
      res.status(201).json(newBrand);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //   get all brand
  const getAllBrand = async (req, res) => {
    try {
      const brands = await Brand.find();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //   get brand by id
  const getBrandById = async (req, res) => {
    try {
      const brand = await Brand.findById(req.params.id);
      if (!brand) return res.status(404).json({ message: "Brand not found" });
      res.json(brand);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {createBrand, getAllBrand, getBrandById};