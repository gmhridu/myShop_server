const express = require("express");
const {
  registerUser,
  loginUser,
  googleSingIn,
  logoutUser,
  refreshAuthToken,
} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleSingIn);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshAuthToken);


router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "User authenticated successfully",
    user,
  });
});

module.exports = router;
