const maxBy = require("lodash/maxBy");
const groupBy = require("lodash/groupBy")
const sumBy = require("lodash/sumBy")
const orderBy = require("lodash/orderBy")
const lodash = require("lodash")
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const dummy = (blogs) => {
    return 1
  }

  const initialBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    }  
  ]
  
const initialUsers = [
    {
        username: "aaaa",
        password: "aaaa",
        name: "aaaa"
    }
]


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

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const tokenAuth = async() => {
  const initUser = initialUsers[0]
  
  const user = await User.findOne({username: initUser.username})
  console.log(user)

  const userDetails = {
    username: user.username,
    name: user.name,
    id:user.id
  }

  const token = jwt.sign(userDetails, process.env.SECRET)
  const toSend = 'Bearer ' + token

  return toSend
}

  module.exports = {
    totalLikes,
    dummy,
    favouriteBlog,
    mostBlogs,
    mostLikes,
    initialBlogs,
    blogsInDb,
    usersInDb,
    tokenAuth
  }