import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          text: 'This is a sample AI response.',
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#1a1a1a' }}>
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 2
            }}
          >
            <Paper
              sx={{
                p: 2,
                maxWidth: '70%',
                bgcolor: message.sender === 'user' ? '#DC004E' : '#2D2D2D',
                color: 'white',
                fontFamily: 'Nekst-Regular'
              }}
            >
              <Typography>
                {message.text}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#DC004E'
                }
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            sx={{
              bgcolor: '#DC004E',
              '&:hover': {
                bgcolor: '#9A0036'
              }
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;