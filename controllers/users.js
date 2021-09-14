const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {title: 1, author: 1, url: 1});
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const body = request.body;
  const password = body.password;
  if (password.length < 3) {
    return response
      .status(400)
      .send({ error: "password length must be greater than 3 character" });
  }
  const saltRound = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRound);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: passwordHash,
  });

  const savedUser = await user.save();
  response.json(savedUser);
});

module.exports = usersRouter;
