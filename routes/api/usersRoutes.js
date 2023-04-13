const express = require("express");const usersController = require("../../controller/usersController");
const router = express.Router();

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .delete(usersController.deleteUser);

router.route("/:id").patch(usersController.updateUser);

module.exports = router;
