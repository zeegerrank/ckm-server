const asyncHandler = require("express-async-handler");const Stock = require("../models/Stock");
const stockController = {
  /** @path GET /api/stock */
  /** @desc Get all stock */
  /** @access Private */
  getAllStocks: asyncHandler(async (req, res) => {
    const stock = await Stock.find().lean().exec();
    res.status(200).json(stock);
  }),

  /** @path POST /api/stock */
  /** @desc Create new stock */
  /** @access Private */
  createNewStock: asyncHandler(async (req, res) => {
    const {
      barcodeNumber,
      name,
      category,
      brand,
      density,
      state,
      quantity,
      unit,
      weightPerUnit,
      totalWeight,
    } = req.body;

    /**check required info */
    if (
      !barcodeNumber ||
      !name ||
      !brand ||
      !state ||
      !unit ||
      !weightPerUnit
    ) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    /**check if stock exists */
    const duplicatedBarcodeNumber = await Stock.findOne({
      barcodeNumber,
    });
    if (duplicatedBarcodeNumber) {
      return res
        .status(400)
        .json({ message: "Barcode number is already exists" });
    }

    /**create new stock */
    const newStock = new Stock({
      barcodeNumber,
      name,
      category,
      brand,
      density,
      state,
      quantity,
      unit,
      weightPerUnit,
      totalWeight,
    });

    /**save stock to database */
    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  }),

  /** @path PATCH /api/stock */
  /** @desc Update stock */
  /** @access Private */
  updateStock: asyncHandler(async (req, res) => {
    const { id } = req.params;

    /** change info as require */
    const {
      barcodeNumber,
      name,
      category,
      brand,
      density,
      state,
      quantity,
      unit,
      weightPerUnit,
      totalWeight,
    } = req.body;

    /**check if stock exists */
    const exitStock = await Stock.findOne({ _id: id });
    if (!exitStock) {
      return res.status(400).json({ message: "Stock not found" });
    }

    /**create new stock */
    const preUpdateStock = new Stock({
      barcodeNumber,
      name,
      category,
      brand,
      density,
      state,
      quantity,
      unit,
      weightPerUnit,
      totalWeight,
    });

    /**update stock */
    const updateStock = await preUpdateStock.save();
    res.status(200).json(updateStock);
  }),

  /** @path DELETE /api/stock */
  /** @desc Delete stock */
  /** @access Private */
  deleteStock: asyncHandler(async (req, res) => {
    const { id } = req.params;
    /** delete stock */
    const deletedStock = await Stock.findByIdAndDelete(id);
    res.status(200).json(deletedStock);
  }),
};
