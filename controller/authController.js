const User = require("../models/User.js");const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc    Auth user & get token
// @route   GET /api/users/login
// @access  Public
const authController = {
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    /**check require field */
    if (!email || !password) {
      res.status(400).json("Please provide an email and password");
    }
    const user = User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json("Invalid email or password");
    }
    const accessToken = jwt.sign(
      {
        userInfo: {
          id: user._id,
          name: user.name,
          roles: user.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match refresh token expiry});
    });
    res.json({ accessToken });
  }),
};

module.exports = authController;
