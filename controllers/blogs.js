const blogRouters = require('express').Router()
const Blog = require('../models/blog')

blogRouters.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogRouters.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = blogRouters;