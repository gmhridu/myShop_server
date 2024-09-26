const express = require("express");
const bodyParser = require("body-parser");
const Order = require("../models/stripe.model");
const Stripe = require("stripe");
const { v4: uuidv4 } = require('uuid');
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Middleware
app.use("/webhook", express.raw({ type: "application/json" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const createOrder = async (req, res) => {
  try {
    const { cartItems, userId, totalAmount, address, cartId, sessionId } =
      req.body;
    if (!address || !address.addressId) {
      return res.status(400).json({ error: "Invalid address data" });
    }

    const paymentDetailsId = uuidv4();

    const newOrder = new Order({
      userId,
      address,
      cartItems,
      totalAmount,
      cartId,
      sessionId,
      paymentDetails: {
        status: "pending",
        id: paymentDetailsId,
      },
      orderStatus: "pending",
    });
    await newOrder.save();

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [item.imageUrl],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/shop/success`,
      cancel_url: `${process.env.CLIENT_URL}/shop/home`,
      metadata: {
        userId,
        orderId: newOrder._id.toString(),
        paymentDetailsId: paymentDetailsId,
      },
    });
    newOrder.sessionId = session.id;
    await newOrder.save();

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error.message);
    res.status(500).json({ error: "Payment session creation failed" });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;

   
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    
    if (order.orderStatus !== "pending") {
      return res
        .status(400)
        .json({ error: "Order already processed or cancelled" });
    }

   
    order.orderStatus = "confirmed";
    order.paymentDetails.status = "paid";
    order.paymentDetails.id = paymentId;

    
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      
      if (product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}. Only ${product.totalStock} left.`,
        });
      }

      
      product.totalStock -= item.quantity;
      await product.save();
    }

    
    await Cart.findByIdAndDelete(order.cartId);

    
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment captured successfully!",
      data: order,
    });
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

app.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }

  
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      await capturePayment(
        {
          body: {
            paymentId: session.payment_intent,
            orderId: session.metadata.orderId,
          },
        },
        res
      );
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});



const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
}

const getAllOrdersByAdmin = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }

}

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

     await Order.findOneAndUpdate({ _id: id }, { orderStatus });
    res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
}

module.exports = {
  createOrder,
  getAllOrdersByUser,
  capturePayment,
  getOrderDetails,
  getAllOrdersByAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
