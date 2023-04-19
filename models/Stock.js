const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StockSchema = new Schema({
  barcodeNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  category: { type: String, default: "N/A" },
  brand: { type: String, required: true },
  density: { type: Number },
  state: { type: String, required: true },
  quantity: { type: Number },
  unit: { type: String, required: true },
  weightPerUnit: { type: Number, required: true },
  totalWeight: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Stock = mongoose.model("Stock", StockSchema);
module.exports = Stock;
