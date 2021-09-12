const mongoose = require("mongoose");
const supertest = require("supertest");
const User = require("../models/user");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);

describe("create user", () => {
  test("get error message when user length < 3", async () => {
    const user = {
      username: "us",
      name: "name",
      password: "12343",
    };

    const result = await api.post("/api/users").send(user).expect(400);
    expect(result.body.error).toContain(
      "user length must be greater than 3 character"
    );
  });

  test("get error message when password length < 3", async () => {
    const user = {
      username: "username 1",
      name: "name",
      password: "1",
    };

    const result = await api.post("/api/users").send(user).expect(400);
    expect(result.body.error).toContain(
      "password length must be greater than 3 character"
    );
  });
  test("get error message when username is existings", async () => {
    await User.deleteMany({});
    const user = {
      username: "user5",
      name: "name",
      password: "1234134",
    };
    await User(user).save();

    const result = await api.post("/api/users").send(user).expect(400);
    expect(result.body.error).toContain("dup");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
