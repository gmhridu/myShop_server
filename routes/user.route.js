const express = require("express");
const {
  registerUser,
  loginUser,
  googleSignIn,
  logoutUser,
  refreshToken,
} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Google Sign-In
router.post("/google", googleSignIn);

// Logout user
router.post("/logout", logoutUser);

// Refresh access token using refresh token
router.post("/refresh-token", refreshToken);

// Middleware protected route
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "User authenticated successfully",
    user,
  });
});

module.exports = router;
