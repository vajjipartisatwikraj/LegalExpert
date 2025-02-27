import express from 'express';
import { createChat, sendMessage, getChatHistory } from '../controllers/chat.controller.js';
import { protect } from '../controllers/auth.controller.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Chat routes
router.post('/', createChat);
router.post('/:chatId/messages', sendMessage);
router.get('/', getChatHistory);

export default router;