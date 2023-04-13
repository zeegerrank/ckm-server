const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const userController = {
  /** @path GET /api/users */
  /** @desc Get all users */
  /** @access Private */
  getAllUsers: asyncHandler(async (req, res) => {
    const users = await User.find().lean().exec();
    res.status(200).json(users);
  }),

  /** @path POST /api/users */
  /** @desc Create new user */
  /** @access Public */
  createNewUser: asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;
    /**check required info */
    if (!email || !username || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    /**check if user exists */
    const duplicatedEmail = await User.findOne({ email });
    const duplicatedUsername = await User.findOne({ username });
    if (duplicatedEmail || duplicatedUsername) {
      return res
        .status(400)
        .json({ message: "Username or email is already exists" });
    }
    /**hash password */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /**create new user */
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      roles: [role],
    });
    /**save user to database */
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  }),

  /** @path PATCH /api/users */
  /** @desc Update user */
  /** @access Private */
  updateUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    /** change info as require */
    const changedUserInfo = await User.findByIdAndUpdate(id, {
      username: req?.body?.username,
      email: req?.body?.email,
      password: req?.body?.password,
      roles: req?.body?.role,
    });
    res.status(200).json(changedUserInfo);
  }),

  /** @path DELETE /api/users */
  /** @desc Delete user */
  /** @access Private */
  deleteUser: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    /** delete user */
    const deletedUser = await User.findByIdAndDelete(_id);
    res.status(200).json(deletedUser);
  }),
};

module.exports = userController;
