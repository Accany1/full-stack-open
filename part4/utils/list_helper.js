const maxBy = require("lodash/maxBy");

const dummy = (blogs) => {
    return 1
  }


const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
      }
    
    return blogs.reduce(reducer, 0)
  }

const favouriteBlog = (blogs) => {
    const highestLike = Math.max(...blogs.map(blog => blog.likes))
    const highestIndex = blogs.findIndex(blog => blog.likes === highestLike)
    return blogs[highestIndex]
}

const mostBlogs = (blogs) => {
    const mostFrequent = maxBy(blogs, (blog) => blog.author)
    const reducer = (sum, blog) => {
        if (blog.author === mostFrequent.author) {
            sum += 1
        } 
        return sum
        }

    const blogNum = blogs.reduce(reducer, 0)

    return {
        author: mostFrequent.author ,
        blogs: blogNum
      }
}

  module.exports = {
    totalLikes,
    dummy,
    favouriteBlog,
    mostBlogs
  }