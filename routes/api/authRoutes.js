const express = require("express");
const router = express.Router();
const authController = require("../../controller/authController");
const loginLimiter = require("../../middleware/loginLimiter");

router.post("/login", loginLimiter, authController.login);

router.get("/refresh", authController.refresh);

router.post("/logout", authController.logout);

module.exports = router;
