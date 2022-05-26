var express = require('express');
var router = express.Router();

const PostsController = require('../controllers/posts')
const handleErrorAsync = require('../services/handErrAsync')

router.get('/', PostsController.getPosts);
router.post('/', PostsController.postPosts);
router.delete('/', PostsController.deleteAllPosts);
router.delete('/:_id', PostsController.deleteOnePosts);
router.patch('/:_id', PostsController.updatePosts);

module.exports = router;
