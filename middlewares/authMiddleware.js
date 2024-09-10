const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({
    success: false,
    message: "Unauthorized user!"
  });
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token!"
    })
  }
};

module.exports = authMiddleware;