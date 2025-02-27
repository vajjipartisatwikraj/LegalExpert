import axios from 'axios';

import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';

// Create new chat
export const createChat = async (req, res) => {
  try {
    const { title, legalDomain } = req.body;
    const chat = await Chat.create({
      user: req.user._id,
      title,
      legalDomain,
      riskLevel: 'Low', // Initial risk level, will be updated by AI
      messages: []
    });

    res.status(201).json({
      status: 'success',
      data: { chat }
    });
  } catch (error) {
    console.error('Error in createChat:', {
      error: error.message,
      stack: error.stack,
      userId: req.user._id
    });

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid chat format',
        details: error.message
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred while creating the chat',
      errorId: Date.now().toString(36) // For error tracking
    });
  }
};

// Send message and get AI response
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message) {
      console.error('Message content is missing');
      return res.status(400).json({
        status: 'fail',
        message: 'Message content is required'
      });
    }

    // Get chat and verify ownership
    const chat = await Chat.findById(chatId);
    if (!chat) {
      console.error(`Chat not found with ID: ${chatId}`);
      return res.status(404).json({
        status: 'fail',
        message: 'Chat not found'
      });
    }

    if (chat.user.toString() !== req.user._id.toString()) {
      console.error(`Unauthorized access attempt to chat ${chatId} by user ${req.user._id}`);
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to access this chat'
      });
    }

    // Add user message to chat
    chat.messages.push({
      role: 'user',
      content: message
    });

    // Verify Mistral API key
    if (!process.env.MISTRAL_API_KEY) {
      console.error('Mistral API key is not configured');
      return res.status(500).json({
        status: 'error',
        message: 'AI service is not properly configured'
      });
    }

    console.log(`Processing chat message for chat ${chatId}`);
    // Get AI response using MistralAI API
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable legal expert. Provide accurate, professional, and helpful legal information while maintaining ethical standards and clarity.'
          },
          ...chat.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 1.2
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    // Add AI response to chat
    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Mistral AI API');
    }

    const aiMessage = response.data.choices[0].message;
    chat.messages.push({
      role: 'assistant',
      content: aiMessage.content
    });

    // Find and suggest relevant lawyers
    if (chat.suggestedLawyers.length === 0) {
      const suggestedLawyers = await findRelevantLawyers(chat.legalDomain);
      chat.suggestedLawyers = suggestedLawyers.map(lawyer => lawyer._id);
    }

    await chat.save();

    res.status(200).json({
      status: 'success',
      data: {
        message: aiMessage.content,
        suggestedLawyers: chat.suggestedLawyers
      }
    });
  } catch (error) {
    console.error('Error in createChat:', {
      error: error.message,
      stack: error.stack,
      userId: req.user._id
    });

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid chat format',
        details: error.message
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred while creating the chat',
      errorId: Date.now().toString(36) // For error tracking
    });
  }
};

// Get user's chat history
export const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .populate('suggestedLawyers', 'name lawyerProfile.experience lawyerProfile.domains lawyerProfile.averageRating')
      .sort('-updatedAt');

    res.status(200).json({
      status: 'success',
      data: { chats }
    });
  } catch (error) {
    console.error('Error in createChat:', {
      error: error.message,
      stack: error.stack,
      userId: req.user._id
    });

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid chat format',
        details: error.message
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred while creating the chat',
      errorId: Date.now().toString(36) // For error tracking
    });
  }
};

// Analyze risk level using MistralAI
const analyzeRiskLevel = async (message) => {
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: 'You are a legal risk assessor. Based on the provided situation, respond ONLY with one of these exact words: "Low", "Medium", or "High". Do not include any additional text.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 100,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    let riskLevel = response.data.choices[0].message.content.trim();
    
    // Validate and normalize risk level
    const validRiskLevels = ['Low', 'Medium', 'High'];
    riskLevel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1).toLowerCase();
    
    if (!validRiskLevels.includes(riskLevel)) {
      console.warn(`Invalid risk level received: ${riskLevel}. Defaulting to 'Low'`);
      riskLevel = 'Low';
    }

    return { riskLevel };
  } catch (error) {
    console.error('Error analyzing risk level:', error);
    return { riskLevel: 'Low' }; // Default to Low risk on error
  }
};

// Find relevant lawyers based on domain
const findRelevantLawyers = async (legalDomain) => {
  const query = {
    role: 'lawyer',
    'lawyerProfile.domains': legalDomain
  };

  return await User.find(query)
    .sort('-lawyerProfile.averageRating -lawyerProfile.experience')
    .limit(3);
};