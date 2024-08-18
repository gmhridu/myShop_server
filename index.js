const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const ConnectDB = require("./db/db");
const productRouter = require("./routes/product.route");

dotenv.config();

const port = process.env.PORT || 9000;
const mongoUri = process.env.MONGODB_URI;

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// connect mongodb
ConnectDB(mongoUri);

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
}

// jwt
app.post('jwt', async(req, res)=> {
    const user = req.body;
    console.log("user for token", user);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
    });
    res.cookie("token", token, cookieOptions).send({success: true});
});

app.post('/logout', (req, res)=> {
    res.clearCookie("token", cookieOptions).send({success: true});
})


// routes
app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.use('/products', productRouter);

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

process.on("unhandledRejection", (error, promise) => {
  console.error("Unhandled rejection at: ", promise, "reason: ", error);
  server.close(() => process.exit(1));
});
