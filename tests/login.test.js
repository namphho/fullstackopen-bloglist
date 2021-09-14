const mongoose = require("mongoose");
const supertest = require("supertest");
const User = require("../models/user");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);


test("login user sucess", async () => {
  await User.deleteMany({})

  const user = {
    username: "user10",
    name: "name10",
    password: "1234",
  };

  const resp = await api.post("/api/users").send(user).expect(200);
  expect(resp.body.username).toEqual("user10");

  const loginResp = await api.post("/api/login").send(user).expect(200);
});

afterAll(() => {
  mongoose.connection.close();
});
