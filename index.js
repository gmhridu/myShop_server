const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const ConnectDB = require("./db/db");
const productRouter = require("./routes/product.route");
const categoryRouter = require("./routes/category.route");
const brandRouter = require("./routes/brand.route");
const colorRouter = require("./routes/color.route");

dotenv.config();

const port = process.env.PORT || 9000;
const mongoUri = process.env.MONGODB_URI;

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://search-filtering.web.app",
    "https://search-filtering.firebaseapp.com",
  ],
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: [
    "Content-type",
    "Authorization",
    "Cache-Control",
    "Expires",
    "Pragma",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// connect mongodb
ConnectDB(mongoUri);

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

// jwt
app.post("/jwt", async (req, res) => {
  const user = req.body;
  console.log("user for token", user);
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30d",
  });
  res.cookie("token", token, cookieOptions).send({ success: true });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions).send({ success: true });
});

// routes
app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.use("/products", productRouter);

app.use("/categories", categoryRouter);

app.use("/brands", brandRouter);

app.use("/colors", colorRouter);

/// error handling
app.use((error, req, res, next) => {
  res.status(500).json({
    message: error.message || "Internal server error",
  });
});

// Page not found handler
app.use((req, res) => {
  res.status(404).json({
    message: "Page not found",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection at:", err);
  server.close(() => process.exit(1));
});
