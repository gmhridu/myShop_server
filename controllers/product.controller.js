const mongoose = require("mongoose");
const Product = require("../models/product.model");
const { imageUploadUtil } = require("./cloudinary");


const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

// add new product
const addProduct = async (req, res) => {
   try {
     const {
       title,
       description,
       price,
       salePrice,
       totalStock,
       category,
       brand,
       imageUrl,
     } = req.body;
     const newProduct = new Product({
       title,
       description,
       price,
       salePrice,
       totalStock,
       category,
       brand,
       imageUrl,
     });

     const savedProduct = await newProduct.save();
     res.status(201).json(savedProduct);
   } catch (error) {
     res.status(500).json({ message: "Failed to create product", error });
   }
};


// fetch all admin Product
const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
}; 

// fetch shop products
const getFilteredProducts = async (req, res) => {
  try {
    const { Category, Brand, price, sortBy } = req.query;

    const filters = {};

    if (Category) filters.category = { $in: Category.split(",") };

   
    if (Brand) filters.brand = { $in: Brand.split(",") };

    
    if (price) {
      const [min, max] = price.split("-");
      filters.price = { $gte: Number(min), $lte: Number(max) };
    }

    
    const sortOption = {};
    if (sortBy === "price-lowtohigh") sortOption.price = 1;
    else if (sortBy === "price-hightolow") sortOption.price = -1;

    const products = await Product.find(filters).sort(sortOption);

    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error occurred while fetching products",
      });
  }
};


// get product by id
const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    };

    res.json({
      success: true,
      message: 'Fetched Product details perfectly',
      data: product
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occurred while getting product details",
    })
  }
}

// edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      imageUrl,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    };

    findProduct.title = title || findProduct.title;
    findProduct.image = imageUrl || findProduct.imageUrl;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price || findProduct.price;
    findProduct.salePrice = salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;

    await findProduct.save();
    res.json({
      success: true,
      message: "Product updated successfully",
      data: findProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};

// delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) { 
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    };
    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Occurred",
    });
  }
};




module.exports = {
  addProduct,
  fetchAllProducts,
  getFilteredProducts,
  getProductDetails,
  editProduct,
  deleteProduct,
  handleImageUpload,
};
