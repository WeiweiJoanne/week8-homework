const mongoose = require('mongoose')

const handleSuccess = require('../services/handleSuccess')
const handleError = require('../services/handleError')
const appErr = require('../services/appErr')

const PostModel = require('../models/posts')

const PostsController = {
  async getPosts(req, res, next) {
    const id = req.params.id
    if (id !== undefined) {
      const getPosts = await PostModel.findById(id).populate({
        path:"user",
        select: "nickName photo createdAt"
      });
      handleSuccess(res, getPosts);
    } else {
      const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
      const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};
      const getPosts = await PostModel.find(q).populate({
        path: "user",
        select: "nickName photo"
      }).sort(timeSort)
      handleSuccess(res, getPosts)
    }
  },
  async postPost(req, res, next) {
    const body = req.body
    const { content, image, user } = body
    if (content == undefined) {
      return appErr(400, '貼文內容沒有填寫', next)
    }
    const postPosts = await PostModel.create({ content, image, user })
    handleSuccess(res, postPosts)
  },
  async updatePost(req, res, next) {
    const id = req.params.id
    const body = req.body
    const { content, image, user } = body

    if (content == undefined || content.trim() == '') {
      return appErr(400, '欲更新的貼文內容沒有填寫', next)
    }
    const updatePosts = await PostModel.findByIdAndUpdate(id, { content, image, user }, { returnDocument: 'after', runValidators: true })
    updatePosts !== null ? handleSuccess(res, updatePosts) : handleError(res)
  },
  async deleteOnePost(req, res, next) {
    const id = req.params.id

    const deleteOnePosts = await PostModel.findByIdAndDelete(id)
    deleteOnePosts !== null ? handleSuccess(res, deleteOnePosts) : handleError(res)
  },
  async deleteAllPosts(req, res, next) {
    const deleteAllPosts = await PostModel.deleteMany({})
    handleSuccess(res, deleteAllPosts)
  },
  async likePost(req, res, next) {
    console.log(req.user.id);
  },
}

module.exports = PostsController
