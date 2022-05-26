var express = require('express');
var router = express.Router();

const PostsController = require('../controllers/posts')
const handleErrorAsync = require('../services/handErrAsync')

router.get('/posts', handleErrorAsync(PostsController.getPosts));
router.post('/post', handleErrorAsync(PostsController.postPost));
router.delete('/posts', handleErrorAsync(PostsController.deleteAllPosts));
router.delete('/post/:id', handleErrorAsync(PostsController.deleteOnePost));
router.patch('/post/:id', handleErrorAsync(PostsController.updatePost));

module.exports = router;
