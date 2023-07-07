import express from 'express';
import { createPost, getPost, updatePost, deletePost, likePost, getTimelinePosts } from '../Controllers/PostController.js';

const router = express.Router();

// router.get('/', (req, res) => {
//     res.send("Post Route");
// });   //this is just to check if the route is working or not

router.post('/', createPost);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.put('/:id/like', likePost);
router.get('/:id/timeline', getTimelinePosts);

export default router;