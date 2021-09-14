const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: error.message });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  } else if (error.name === "MongoServerError") {
    return response.status(400).send({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).send({ error: "invalid token" });
  }
  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
    next();
  } else {
    return response.status(401).send({ error: "token is missing" });
  }
};

const userExtractor = async (request, response, next) => {
  const token = request.token;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  request.user = await User.findById(decodedToken.id);
  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
};
