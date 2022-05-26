const mongoose = require('mongoose')

const handleSuccess = require('../services/handleSuccess')
const handleError = require('../services/handleError')
const appErr = require('../services/appErr')
const handErrAsync = require('../services/handErrAsync')

const PostModel = require('../models/posts')
// const UserModel = require('../models/user')

const PostsController = {
  getPosts: handErrAsync(async (req, res, next) =>{
    const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};
    const getPosts = await PostModel.find(q).populate({
      path: "user",
      select: "name photo"
    }).sort(timeSort)
    handleSuccess(res, getPosts)
  }),
  postPosts: handErrAsync(async (req, res, next) => {
    const body = req.body
    const { content, image, user } = body
    if (content == undefined) {
      return appErr(400, '貼文內容沒有填寫', next)
    }
    // 判斷使用者User ObjectId (若傳入不存在的 User ObjectId ，也會新增成功)
    // findById(id).exec(); 如果找不到就是 null
    // const hasUser = await UserModel.findById(user).exec()
    const postPosts = await PostModel.create({ content, image, user })
    handleSuccess(res, postPosts)

  }),
  updatePosts: handErrAsync(async (req,res,next)=>{
    const id = req.params._id
    const body = req.body
    const { content, image, user } = body
    if(!id){
      return appErr(400, '欲更新的貼文ID不存在', next)
    }
    if (content == undefined || content.trim() == '') {
      return appErr(400, '欲更新的貼文內容沒有填寫', next)
    }
    const updatePosts = await PostModel.findByIdAndUpdate(id,{ content, image, user },{ returnDocument: 'after', runValidators: true })
    updatePosts !== null ? handleSuccess(res, updatePosts) : handleError(res)
  }),
  deleteOnePosts: handErrAsync(async (req, res, next) => {
    const id = req.params._id
    if (!id) {
      return appErr(400, '欲刪除的貼文ID不存在', next)
    }
    const deleteOnePosts = await PostModel.findByIdAndDelete(id)
    deleteOnePosts !== null ? handleSuccess(res, deleteOnePosts) : handleError(res)
  }),
  deleteAllPosts: handErrAsync(async (req, res, next) => {
    const deleteAllPosts = await PostModel.deleteMany({})
    handleSuccess(res, deleteAllPosts)
  }),
}

module.exports = PostsController
