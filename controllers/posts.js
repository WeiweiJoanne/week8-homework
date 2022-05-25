const mongoose = require('mongoose')

const handleSuccess = require('../services/handleSuccess')
const handleError = require('../services/handleError')

const PostModel = require('../models/posts')
const UserModel = require('../models/user')

const PostsController = {
  async getPosts(req, res) {
    const timeSort = req.query.timeSort == 'asc' ? 'createdAt' :'-createdAt';
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};
    const getPosts = await PostModel.find(q).populate({
      path:"user",
      select: "name photo"
    }).sort(timeSort)
    handleSuccess(res, getPosts)
  },
  async postPosts(req, res) {
    const body = req.body
    const { content, image, user } = body
    try{
      // 判斷使用者User ObjectId (若傳入不存在的 User ObjectId ，也會新增成功)
      // findById(id).exec(); 如果找不到就是 null
      const hasUser = await UserModel.findById(user).exec()
      if (hasUser !== null) {
        if (content.trim() !== '') {
          const postPosts = await PostModel.create({
            content, image, user
          })
          handleSuccess(res, postPosts)
        } else {
          handleError(res)
        }
      } else {
        handleError(res)
      }
    }catch(err){
      handleError(res, err)
    }
    
    
  },
  async updatePosts(req, res) {
    const id = req.params
    const body = req.body
    const { content, image, user } = body

    if (content.trim() !== '') {
      try {
        const updatePosts = await PostModel.findByIdAndUpdate(
          id,
          { content, image, user },
          { returnDocument: 'after', runValidators: true }
        )
        updatePosts !== null ? handleSuccess(res, updatePosts) : handleError(res)
      } catch (err) {
        handleError(res, err)
      }
    } else {
      handleError(res)
    }
  },
  async deleteOnePosts(req, res) {
    const id = req.params
    try {
      const deleteOnePosts = await PostModel.deleteOne(id)
      if (deleteOnePosts !== null){
        handleSuccess(res, deleteOnePosts)
      }else{
        handleError(res)
      }
    } catch (err) {
      handleError(res, err)
    }
  },
  async deleteAllPosts(req, res) {
    try {
      const deleteAllPosts = await PostModel.deleteMany({})
      if (deleteAllPosts !== null) {
        handleSuccess(res, deleteAllPosts)
      } else {
        handleError(res)
      }
    } catch (err) {
      handleError(res, err)
    }
  },
}

module.exports = PostsController
