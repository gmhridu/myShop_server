const express = require("express");
const {
  handleImageUpload,
  fetchAllProducts,
  editProduct,
  deleteProduct,
  addProduct,
  getFilteredProducts,
  getProductDetails,
} = require("../controllers/product.controller");
const { upload } = require("../controllers/cloudinary");

const productRouter = express.Router();

productRouter.post("/add", addProduct);

productRouter.get("/get", fetchAllProducts);

productRouter.get("/shop/get", getFilteredProducts);

productRouter.get("/shop/details/:id", getProductDetails);

productRouter.put("/edit/:id", editProduct);

productRouter.delete("/delete/:id", deleteProduct);
productRouter.post(
  "/upload-image",
  upload.single("my_file"),
  handleImageUpload
);

module.exports = productRouter;
