const logger = require("./logger");
const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: error.message });
  } else if (error.name === "ValidationError") {
    return response.status(400).end();
  }
  next(error);
};

module.exports = {
  errorHandler,
};
