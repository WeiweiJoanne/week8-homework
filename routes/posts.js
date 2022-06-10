var express = require('express');
var router = express.Router();

const PostsController = require('../controllers/posts')
const handErrAsync = require('../services/handErrAsync')
const { isAuth } = require('../services/auth')

router.get('/posts', isAuth, handErrAsync(PostsController.getPosts));
router.get('/posts/:id', isAuth, handErrAsync(PostsController.getPosts));
router.post('/post', isAuth, handErrAsync(PostsController.postPost));
router.delete('/posts',isAuth, handErrAsync(PostsController.deleteAllPosts));
router.delete('/post/:id',isAuth, handErrAsync(PostsController.deleteOnePost));
router.patch('/post/:id',isAuth, handErrAsync(PostsController.updatePost));

router.post('/post/:id/like',isAuth, handErrAsync(PostsController.likePost));
router.delete('/post/:id/unlike', isAuth, handErrAsync(PostsController.unLikePost));

module.exports = router;
