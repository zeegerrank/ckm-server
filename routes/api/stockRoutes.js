const express = require("express");const router = express.Router();

router
  .route("/")
  .get(stockController.getAllStocks)
  .post(stockController.createNewStock)
  .delete(stockController.deleteStock);

router.route("/:id").patch(stockController.updateStock);

module.exports = router;
