const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  //array of mongoose objects for each of the notes in the helper initial notes array
  const blogObjects = listHelper.initialBlogs
    .map(blog => new Blog(blog))
  // array of promises for saving each item to the database
  const blogArray = blogObjects.map(blog => blog.save())
  // make sure every promise in the array given is fufilled
  await Promise.all(blogArray)
})

test('all blog posts are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, listHelper.initialBlogs.length)
})

test('identifier property is id', async () => {
  const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

  const contents = response.body.map(e => e.id)
  assert(contents.includes(listHelper.initialBlogs[0]._id))
})

test('a blog can be added', async () => {
  const newBlog = {
    title: "I am new blog",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/BLOG.html",
    likes: 20,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await listHelper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, listHelper.initialBlogs.length +1)

  const contents = blogsAtEnd.map(n => n.title)

  assert(contents.includes('I am new blog'))
})

after(async () => {
  await mongoose.connection.close()
})
