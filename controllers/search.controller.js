const Product = require("../models/product.model");

const searchProduct = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Invalid keyword provided. Please provide a non-empty string.",
      });
    };

    const regEx = new RegExp(keyword, 'i')

    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx }
      ]
    };

    const products = await Product.find(createSearchQuery);

    res.status(200).json({
      success: true,
      message: "Products found successfully.",
      count: products.length,
      data: products,
    })
   
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while searching for products.",
    });
  }
};

module.exports = {
  searchProduct,
};
