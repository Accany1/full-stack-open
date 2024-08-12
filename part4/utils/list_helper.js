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
  
  module.exports = {
    totalLikes,
    dummy,
    favouriteBlog
  }