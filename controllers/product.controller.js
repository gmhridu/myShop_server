const Product = require("../models/product.model");

const createProduct = async (req, res) => {
  try {
    const body = req.body;
    const newProduct = await Product.create(body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: err.message,
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

// get pagination
const getPagination = async (req, res) => {
  try {
    const size = parseInt(req.query.size) || 6;
    const page = parseInt(req.query.page) || 1;
    const filter = req.query.filter;
    const sort =
      req.query.sort === "asc" ? 1 : req.query.sort === "dec" ? -1 : null;

    let query = {};

    if (filter) {
      const parsedFilter = JSON.parse(filter);

      if (parsedFilter.category) {
        query.category = { $in: parsedFilter.category };
      }
      if (parsedFilter.brand) {
        query.brandName = { $in: parsedFilter.brand };
      }
      if (parsedFilter.color) {
        query.color = { $in: parsedFilter.color };
      }
      if (parsedFilter.price) {
        const { min, max } = parsedFilter.priceRange;
        query.price = { $gte: min, $lte: max };
      }
    }

    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { brandName: { $regex: search, $options: "i" } },
        { color: { $regex: search, $options: "i" } },
      ];
    }

    let sortQuery = {};
    if (req.query.sortBy) {
      sortQuery[req.query.sortBy] = sort;
    }

    const products = await Product.find(query)
      .sort(sortQuery)
      .skip((page - 1) * size)
      .limit(size);

    const totalProducts = await Product.countDocuments(query);

    const totalPages = Math.ceil(totalProducts / size);

    res.json({
      products,
      totalProducts,
      totalPages,
      currentPage: page,
      size: size,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

module.exports = { createProduct, getAllProduct, getProductById, getPagination };
