const blogRouters = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogRouters.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogRouters.post("/", async (request, response) => {
  const body = request.body;
  const user = request.user;
  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    user: user._id,
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogRouters.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const user = request.user;
  const blog = await Blog.findById(id);
  if (!blog) {
    return response.status(400).json({ error: "blog is not existing" });
  }
  if (blog.user.toString() === user._id.toString()) {
    await blog.remove();
    response.status(204).end();
  } else {
    response
      .status(400)
      .json({ error: "you just delete blog which is created by yourself" });
  }
});

blogRouters.put("/:id", async (request, response) => {
  const body = request.body;
  const updateData = {
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    updateData,
    { new: true }
  );
  response.json(updatedBlog);
});

module.exports = blogRouters;
