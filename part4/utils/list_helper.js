const maxBy = require("lodash/maxBy");
const groupBy = require("lodash/groupBy")
const sumBy = require("lodash/sumBy")
const orderBy = require("lodash/orderBy")
const lodash = require("lodash")

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

const mostLikes = (blogs) => {
    const reducedList = groupBy(blogs, 'author')

    const likesByAuthor = lodash.map(reducedList, (blog,author) => 
      ({
      author, likes: lodash.sumBy(blog,'likes')
    }))

    const maxAuthor = maxBy(likesByAuthor, 'likes')

    
    // for (author in reducedList) {
    //     const total = sumBy(reducedList[author], (author) => author.likes)
    //     reducedList[author].author = author
    //     reducedList[author].likes = total
    // }

    // const orderedList = orderBy(reducedList, ['likes,author'],['desc'])

    return maxAuthor
}

  module.exports = {
    totalLikes,
    dummy,
    favouriteBlog,
    mostBlogs,
    mostLikes
  }