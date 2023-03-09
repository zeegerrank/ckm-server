require("dotenv").config();const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { dbConnect } = require("./config/dbConnect");

console.log(process.env.NODE_ENV);

dbConnect();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = 3500 || process.env.PORT;
mongoose.connection.once("open", () => {
  console.log("Connected to database");
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
