const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blogs) => blogs.likes + sum;
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    const reducer = (prev, current) => {
      if (prev.likes > current.likes) {
        return prev;
      }
      return {
        title: current.title,
        author: current.author,
        likes: current.likes,
      };
    };
    return blogs.reduce(reducer, blogs[0]);
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    let group = _.groupBy(blogs, (blog) => blog.author);
    const groups = Object.keys(group).map((key) => {
      return {
        author: key,
        blogs: group[key].length,
      };
    });
    return groups.reduce((a, b) => (a.length > b.length ? a : b));
  }
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    let group = _.groupBy(blogs, (blog) => blog.author);
    const groupAuthorAndLikes = Object.keys(group).map((key) => {
      let sum = (prev, current) => current.likes + prev;
      let totalOfLikes = group[key].reduce(sum, 0);
      return {
        author: key,
        likes: totalOfLikes,
      };
    });
    return groupAuthorAndLikes.reduce((a, b) => (a.likes > b.likes ? a : b));
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
