const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');

// Get all chats for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json({ status: 'success', data: { chats } });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Create a new chat
router.post('/', auth, async (req, res) => {
  try {
    const { title, legalDomain } = req.body;
    const chat = new Chat({
      user: req.user.id,
      title,
      legalDomain,
      messages: []
    });
    await chat.save();
    res.json({ status: 'success', data: { chat } });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Add a message to a chat
router.post('/:chatId/messages', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.chatId, user: req.user.id });
    if (!chat) {
      return res.status(404).json({ status: 'error', message: 'Chat not found' });
    }

    const { message } = req.body;
    chat.messages.push({ role: 'user', content: message });
    
    // AI response simulation
    const aiResponse = `This is a simulated AI response to: ${message}`;
    chat.messages.push({ role: 'assistant', content: aiResponse });
    
    await chat.save();
    res.json({ status: 'success', data: { message: aiResponse } });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Delete a chat
router.delete('/:chatId', auth, async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.chatId, user: req.user.id });
    if (!chat) {
      return res.status(404).json({ status: 'error', message: 'Chat not found' });
    }
    res.json({ status: 'success', data: { message: 'Chat deleted successfully' } });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;