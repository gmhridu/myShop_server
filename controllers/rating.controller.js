const Product = require("../models/product.model");
const Rating = require("../models/rating.model");
const Order = require("../models/stripe.model");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: "confirmed",
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "User has not ordered this product",
      });
    }

    const checkExistingReview = await Rating.findOne({ productId, userId });
    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "User has already reviewed this product",
      });
    }

    const newReview = new Rating({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });
    await newReview.save();

    const reviews = await Rating.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { averageReview } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Review added successfully",
      review: newReview,
      updatedProduct,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};


const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Rating.find({ productId });

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addProductReview,
  getProductReviews,
};

