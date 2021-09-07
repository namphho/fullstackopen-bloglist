const config = require("./utils/config");
const logger = require("./utils/logger");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouters = require("./controllers/blogs")

//connect to DB
logger.info(config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected success");
    console.log();
  })
  .catch((error) => {
    logger.info("error connection to MongoDB", error.message);
  });

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouters);


module.exports = app