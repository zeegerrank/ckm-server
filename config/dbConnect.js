require("dotenv").config();const mongoose = require("mongoose");

const database_uri = process.env.DATABASE_URI;

const dbConnect = () => {
  mongoose.connect(database_uri).catch((err) => console.log(err));
};

module.exports = { dbConnect };
