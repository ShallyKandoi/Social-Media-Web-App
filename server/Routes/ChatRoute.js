import express from 'express';
import { createChat, userChats, findChat } from '../Controllers/ChatController.js';

const router = express.Router();

router.post('/', createChat);
router.get('/:userId', userChats);
router.get('/find/:firstUserId/:secondUserId', findChat);

export default router;