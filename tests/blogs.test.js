const mongoose = require("mongoose");
const supertest = require("supertest");
const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((m) => new Blog(m));
  const promisedArray = blogObjects.map((o) => o.save());
  await Promise.all(promisedArray);
});

describe("where there is some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all notes are required", async () => {
    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.initialBlogs.length);
  });

  test("blog post object has id property", () => {
    const blogs = helper.initialBlogs.map((b) => Blog(b));
    const processJSONBlogs = blogs.map((b) => b.toJSON());
    const blogToVerify = processJSONBlogs[0];
    expect(blogToVerify.id).toBeDefined();
  });
});

describe("aditional new blog", () => {
  var token;
  beforeEach(async () => {
    await User.deleteMany({});
    const user = {
      username: "user10",
      name: "name10",
      password: "1234",
    };
    await api.post("/api/users").send(user);
    const loginResp = await api
      .post("/api/login")
      .send({ username: "user10", password: "1234" })
      .expect(200);
    token = loginResp.body.token;
  });

  test("save blog successfully", async () => {
    const newBlog = {
      title: "Test Title",
      author: "Hnam",
      url: "http://example.com/example.pdf",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const contents = blogsAtEnd.map((m) => m.title);
    expect(contents).toContain("Test Title");
  });

  test("save blog without like property", async () => {
    const newBlog = {
      title: "Test Title",
      author: "Hnam",
      url: "http://example.com/example.pdf",
    };
    const savedBlog = await api
      .post("/api/blogs")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(savedBlog.body.likes).toEqual(0);
  });

  test("save blog without title & author property and got 400", async () => {
    const newBlog = {
      url: "http://example.com/example.pdf",
    };
    await api
      .post("/api/blogs")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(newBlog)
      .expect(400);
  });

  test("save blog without authorized", async () => {
    const newBlog = {
      title: "Test Title",
      author: "Hnam",
      url: "http://example.com/example.pdf",
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401);
  });
});

describe("deletion of the blogs", () => {
  test("success with status code 204", async () => {
    const blogs = await helper.blogsInDb();
    const blogsNeedToDetele = blogs[0];

    await api.delete(`/api/blogs/${blogsNeedToDetele.id}`).expect(204);

    const blogsAfterDelete = await helper.blogsInDb();
    expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAfterDelete.map((r) => r.title);
    expect(titles).not.toContain(blogsNeedToDetele.title);
  });

  test("success with status code 404 with wrong id format", async () => {
    const wrongIdFormat = "613c83034263abccc";

    await api.delete(`/api/blogs/${wrongIdFormat}`).expect(400);
  });

  test("success with status code 204 with invalid id", async () => {
    const invalidId = await helper.nonExistingId();

    await api.delete(`/api/blogs/${invalidId}`).expect(204);
  });
});

describe("update of the blogs", () => {
  test("success with status code 204", async () => {
    const blogs = await helper.blogsInDb();
    const blogsNeedToUpdate = blogs[0];

    const updatedBlog = await api
      .put(`/api/blogs/${blogsNeedToUpdate.id}`)
      .send({ likes: 13 })
      .expect(200);

    expect(updatedBlog.body.likes).toEqual(13);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
