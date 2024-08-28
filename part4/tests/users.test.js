
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')


const helper = require('../utils/list_helper')

const Blog = require('../models/blog')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany()

    const passwordHash = await bcrypt.hash('aaaa', 10)
    const user = new User({ username: 'aaaa', passwordHash })

    await user.save()

    
    const blogId = helper.initialBlogs
      .map(blog => {
        return {
          ...blog,
          user: user.id
        }
      })
    const blogObjects = blogId
      .map(blog => new Blog(blog))
    // array of promises for saving each item to the database
    const blogArray = blogObjects.map(blog => blog.save())
    // make sure every promise in the array given is fufilled
    await Promise.all(blogArray)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('password too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'fzvjdjwfs',
      name: 'fdsfsf',
      password: 'as',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Password too short'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'aaaa',
      name: 'aaaa',
      password: 'aaaa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

test('A blog without auth', async () => {
  const newBlog = {
    title: "I am new blog",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/BLOG.html",
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog can be added', async () => {
  const auth = await helper.tokenAuth()

  const newBlog = {
    title: "I am new blog",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/BLOG.html",
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization',auth)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length +1)

  const contents = blogsAtEnd.map(n => n.title)

  assert(contents.includes('I am new blog'))
})

after(async () => {
  await mongoose.connection.close()
})