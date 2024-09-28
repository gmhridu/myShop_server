const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate access and refresh tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      userName: user.userName,
    },
    process.env.SECRET_KEY,
    { expiresIn: "60m" } // Access token lasts 1 hour
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.REFRESH_TOKEN_SECRET, // Different secret for refresh token
    { expiresIn: "7d" } // Refresh token lasts 7 days
  );

  return { accessToken, refreshToken };
};

// Register user
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, email, password: hashPassword });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, checkUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const { accessToken, refreshToken } = generateTokens(checkUser);

    // Set cookies
    res.cookie("token", accessToken, { httpOnly: true, secure: false });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/refresh-token",
    });

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// Google Sign-In
const googleSingIn = async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name } = payload;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        userName: name,
        email,
        role: "user",
        password: "",
      });
      await user.save();
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("token", accessToken, { httpOnly: true, secure: false });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/refresh-token",
    });

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        email: user.email,
        role: user.role,
        id: user._id,
      },
    });
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Logout user
const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken", { path: "/refresh-token" });
  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};

// Refresh token
const refreshAuthToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token not found",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role, email: decoded.email },
      process.env.SECRET_KEY,
      { expiresIn: "60m" } 
    );

    res.cookie("token", newAccessToken, { httpOnly: true, secure: false });

    return res.json({
      success: true,
      message: "New access token issued",
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleSingIn,
  logoutUser,
  refreshAuthToken,
};
