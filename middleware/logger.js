const express = require("express");
const morgan = require("morgan");
const { format } = require("date-fns");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid").v4;

const logEvent = (logText, logFileName) => {
  const dateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  try {
    if (!fs.existsSync(path.join(__dirname, "../logs"))) {
      fs.promises.mkdir(path.join(__dirname, "../logs"));
    } else {
      fs.createWriteStream(path.join(__dirname, `../logs/${logFileName}.log`), {
        flags: "a",
      }).write(`${uuid()}\t${dateTime}\t${logText}\n`);
    }
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  const logText = `${req.method}\t${req.url}\t${req.headers.origin}`;
  logEvent(logText, "server");
  next();
};

const errorLogger = (err, req, res, next) => {
  const logText = `${req.method}\t${req.url}\t${err.message}`;
  logEvent(logText, "error");
  next();
};

module.exports = { logEvent, logger, errorLogger };
