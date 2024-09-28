const express = require('express');
const {
  registerUser,
  loginUser,
  googleSingIn,
  logoutUser,
  refreshAuthToken,
} = require("../controllers/user.controller");
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// register router
router.post('/register', registerUser);

// refresh token
router.get('/refresh-token', refreshAuthToken);

// login router
router.post('/login', loginUser);

// google signIn router
router.post('/google', googleSingIn);

// logout router

router.post("/logout", logoutUser);

// middleware
router.get('/check-auth', authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "User authenticated successfully",
    user
  })
})

module.exports = router;