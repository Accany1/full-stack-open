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

after(async () => {
  await mongoose.connection.close()
})
