const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "Comment 為必填"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "post",
    required: [true, "該評論沒有所屬po文"]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "該評論查無出處"]
  }
},{
  versionKey:false
})

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path:'user',
    select:'_id nickName createdAt'
  })
  next();
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
