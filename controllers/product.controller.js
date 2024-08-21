const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Brand = require("../models/brand.model");
const Color = require("../models/color.model");

const createProduct = async (req, res) => {
  try {
    const { category, brandName, color, ...body } = req.body;

    // Find or create the category
    let categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      categoryDoc = await Category.create({ name: category });
    }

    // Find or create the brand
    let brandDoc = await Brand.findOne({ name: brandName });
    if (!brandDoc) {
      brandDoc = await Brand.create({ name: brandName });
    }

    // Find or create the color
    let colorDoc = await Color.findOne({ name: color });
    if (!colorDoc) {
      colorDoc = await Color.create({ name: color });
    }

    // Create the product with references to the created/found category, brand, and color
    const newProduct = await Product.create({
      ...body,
      category: categoryDoc._id,
      brandName: brandDoc._id,
      color: colorDoc._id,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// http://localhost:5000/products?page=1&size=6&filter={"category":["Electronics"],"brandName":["TechBrand"],"color":["Black"],"price":[400,1500]}&sort=price&search=

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      size = 6,
      filter = "{}",
      sort = "",
      search = "",
    } = req.query;

    let filters = {};
    try {
      filters = JSON.parse(filter);
    } catch (parseError) {
      return res
        .status(400)
        .json({ message: "Invalid filter JSON", error: parseError.message });
    }

    const categoryIds =
      filters.category && filters.category.length
        ? await Category.find({ name: { $in: filters.category } }).select("_id")
        : [];
    const brandIds =
      filters.brand && filters.brand.length
        ? await Brand.find({ name: { $in: filters.brand } }).select("_id")
        : [];
    const colorIds =
      filters.color && filters.color.length
        ? await Color.find({ name: { $in: filters.color } }).select("_id")
        : [];

    const categoryFilter = categoryIds.length
      ? { category: { $in: categoryIds.map((cat) => cat._id) } }
      : {};
    const brandFilter = brandIds.length
      ? { brandName: { $in: brandIds.map((brand) => brand._id) } }
      : {};
    const colorFilter = colorIds.length
      ? { color: { $in: colorIds.map((color) => color._id) } }
      : {};
    const priceFilter =
      filters.price && filters.price.length === 2
        ? {
            price: {
              $gte: parseInt(filters.price[0]),
              $lte: parseInt(filters.price[1]),
            },
          }
        : {};

    const searchFilter = search
      ? { productName: { $regex: search, $options: "i" } }
      : {};

    const finalFilter = {
      ...categoryFilter,
      ...brandFilter,
      ...colorFilter,
      ...priceFilter,
      ...searchFilter,
    };

    const sortOptions = sort
      ? sort.split(",").reduce((acc, sortField) => {
          const [key, order] = sortField.startsWith("-")
            ? [sortField.slice(1), -1]
            : [sortField, 1];
          acc[key] = order;
          return acc;
        }, {})
      : {};

    const limit = parseInt(size);
    const skip = (parseInt(page) - 1) * limit;

    const products = await Product.find(finalFilter)
      .populate("category")
      .populate("brandName")
      .populate("color")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(finalFilter);

    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: parseInt(page),
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  getProducts,

  // getPagination,
  // getDataCount,
};
