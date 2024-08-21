const Category = require("../models/category.model");

// Create Category
const createCategory = async (req, res) => {
    try {
      const newCategory = await Category.create(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

//   get all category
const getAllCategory = async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //   get category by id
  const getCategoryById = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ message: "Category not found" });
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {createCategory, getAllCategory, getCategoryById};
