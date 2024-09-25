const mongoose = require("mongoose");

const stripeSchema = new mongoose.Schema(
  {
    userId: String,
    cartId: String,
    cartItems: [
      {
        productId: String,
        imageUrl: String,
        quantity: Number,
        price: Number,
        salePrice: Number,
        title: String,
        imageUrl: String,
      },
    ],
    address: {
      addressId: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      phone: String,
      notes: String,
    },
    totalAmount: Number,
    paymentDetails: {
      id: { type: String },
      status: { type: String, default: "pending" },
      createdAt: { type: Date, default: Date.now },
    },
    sessionId: String,
    orderStatus: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", stripeSchema);

module.exports = Order;
