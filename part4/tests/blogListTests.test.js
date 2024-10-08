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

  // for(let blog of listHelper.initialBlogs){
  //   let blogObject = new Blog(blog)
  //   await blogObject.save()
  // }
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

test('if likes is missing, it is zero', async () => {
  const newBlog = {
    title: "I am new blog",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/BLOG.html"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await listHelper.blogsInDb()
  assert.strictEqual(blogsAtEnd[(blogsAtEnd.length-1)].likes,0)
})

test('if title or url is missing, return 400', async () => {
  const newBlog = {
    author: "Edsger W. Dijkstra"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await listHelper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, listHelper.initialBlogs.length)
})

test('deletes blog, succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await listHelper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await listHelper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, listHelper.initialBlogs.length - 1)

  const contents = blogsAtEnd.map(r => r.title)
  assert(!contents.includes(blogToDelete.title))
})

test('update blog post', async () => {
  const blogsAtStart = await listHelper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const newBlog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 10,
    id: "5a422a851b54a676234d17f7"
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await listHelper.blogsInDb()

  assert.strictEqual(blogsAtEnd[0].likes, newBlog.likes)
})


after(async () => {
  await mongoose.connection.close()
})
