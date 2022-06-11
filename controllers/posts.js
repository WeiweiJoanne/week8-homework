const mongoose = require('mongoose')

const handleSuccess = require('../services/handleSuccess')
const handleError = require('../services/handleError')
const appErr = require('../services/appErr')

const PostModel = require('../models/posts')
const CommentModel = require('../models/comment')

const PostsController = {
  async getPosts(req, res, next) {
    const _id = req.params.id
    if (_id !== undefined) {
      const getPosts = await PostModel.findById({_id}).populate({
        path: "user",
        select: "nickName photo"
      }).populate({
        path: 'comments',
        select: 'comment user'
      });
      handleSuccess(res, getPosts);
    } else {
      const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
      const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};
      const getPosts = await PostModel.find(q)
      .populate({
        path: "user",
        select: "nickName photo"
      })
      .populate({
        path:"comments",
        select:'comment user'
      }).sort(timeSort)
      handleSuccess(res, getPosts)
    }
  },
  async postPost(req, res, next) {
    const body = req.body
    const user = req.user.id
    const { content, image } = body
    if (content == undefined) {
      return appErr(400, '貼文內容沒有填寫', next)
    }
    const postPosts = await PostModel.create({ content, image, user })
    handleSuccess(res, postPosts)
  },
  async updatePost(req, res, next) {
    const _id = req.params.id
    const body = req.body
    const { content, image, user } = body

    if (content == undefined || content.trim() == '') {
      return appErr(400, '欲更新的貼文內容沒有填寫', next)
    }
    const updatePosts = await PostModel.findByIdAndUpdate(_id, { content, image, user }, { returnDocument: 'after', runValidators: true })
    updatePosts !== null ? handleSuccess(res, updatePosts) : handleError(res)
  },
  async deleteOnePost(req, res, next) {
    const _id = req.params.id

    const deleteOnePosts = await PostModel.findByIdAndDelete(_id)
    deleteOnePosts !== null ? handleSuccess(res, deleteOnePosts) : handleError(res)
  },
  async deleteAllPosts(req, res, next) {
    const deleteAllPosts = await PostModel.deleteMany({})
    handleSuccess(res, deleteAllPosts)
  },
  async likePost(req, res, next) {
    const userID = req.user.id
    const _id = req.params.id

    const addLike = await PostModel.findByIdAndUpdate({ _id }, { $addToSet: { likes: userID } }, { returnDocument: 'after' })
    res.status(201).send({
      "status": "success",
      addLike
    })
  },
  async unLikePost(req, res, next) {
    const userID = req.user.id
    const _id = req.params.id

    const unLike = await PostModel.findByIdAndUpdate({ _id }, { $pull: { likes: userID } }, { returnDocument: 'after' })
    res.status(201).send({
      "status": "success",
      unLike
    })
  },
  async addComment(req, res, next) {
    const user = req.user.id
    const post = req.params.id
    const { comment } = req.body

    if (!comment) {
      return appErr(400, '留言內容沒有填寫', next)
    }

    const addComment = await CommentModel.create({
      comment, user, post
    })
    res.status(201).send({
      "status": "success",
      addComment
    })
  },
  async getUserPosts(req, res, next) {
    const user = req.params.user
    console.log(user, req.user.id);
    if (user !== req.user.id) {
      return appErr(400, '使用者ID不符合', next)
    }

    const getUserPosts = await PostModel.find({ user }).populate({
      path: 'comments',
      select: 'comment user'
    })
    res.status(201).send({
      "status": "success",
      getUserPosts
    })
  },
}

module.exports = PostsController
