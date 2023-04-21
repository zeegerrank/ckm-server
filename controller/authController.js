const User = require("../models/User.js");const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  // @desc    Auth user & get token
  // @route   GET /api/users/login
  // @access  Public
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    /**check require field */
    if (!email || !password) {
      return res.status(400).json("Please provide an email and password");
    }
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(401).json("Invalid email or password");
    } else if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json("Invalid email or password");
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          username: user.username,
          roles: user.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { username: user.username, id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match refresh token expiry});
    });
    res.json({ accessToken });
  }),
  /**@desc Use when page refresh, so refreshToken will be send */
  /**@route GET /auth/refresh */
  /**@access Public  - because access token has expired*/
  refresh: asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });

        const user = await User.findOne({
          username: decoded.username,
        }).exec();

        if (!user) return res.status(401).json({ message: "Unauthorized" });

        const accessToken = jwt.sign(
          {
            userInfo: {
              username: user.username,
              roles: user.roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.json({ accessToken });
      }
    );
  }),
  logout: asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(201).json({ message: "No JWT Cookie" });
    }
    res.clearCookie("jwt");
    res.json({ message: "JWT Cookie Clear" });
  }),
};

module.exports = authController;
