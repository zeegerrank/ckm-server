require("dotenv").config();const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { dbConnect } = require("./config/dbConnect");
const corsOptions = require("./config/corsOptions");
const { logEvent } = require("./middleware/logger");

console.log(process.env.NODE_ENV);

dbConnect();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(
  morgan(`origin: ":referrer" [:date[clf]] :method ":url" status: :status`)
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/** Routes */
app.use("/api/users", require("./routes/api/usersRoutes"));
app.use("/api/stocks", require("./routes/api/stocksRoutes"));
app.use("/api/auth", require("./routes/api/authRoutes"));

const port = process.env.PORT || 3500;
mongoose.connection.once("open", () => {
  console.log("Connected to database");
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvent(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "DatabaseErrLog.log"
  );
});
