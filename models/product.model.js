const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    imageUrl: String,
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: String,
    brand: String,
    price: {
      type: Number,
      required: true,
    },
    salePrice: Number,
    totalStock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
