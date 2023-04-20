const express = require("express");
const router = express.Router();
const stocksController = require("../../controller/stocksController");

router
  .route("/")
  .get(stocksController.getAllStocks)
  .post(stocksController.createNewStock)
  .delete(stocksController.deleteStock);

router.route("/:id").patch(stocksController.updateStock);

module.exports = router;
