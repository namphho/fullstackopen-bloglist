const blogRouters = require("express").Router();
const Blog = require("../models/blog");

blogRouters.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouters.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogRouters.delete("/:id", async (request, response) => {
  const id = request.params.id;
  await Blog.findByIdAndRemove(id);
  response.status(204).end();
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
