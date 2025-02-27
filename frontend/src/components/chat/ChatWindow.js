import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const ChatWindow = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chatId) {
      fetchChatHistory();
    }
  }, [chatId]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        const currentChat = data.data.chats.find(chat => chat._id === chatId);
        if (currentChat) {
          setMessages(currentChat.messages);
        }
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: newMessage })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessages(prev => [...prev, 
          { role: 'user', content: newMessage },
          { role: 'assistant', content: data.data.message }
        ]);
        setNewMessage('');
      } else {
        console.error('Error from server:', data.message);
        setMessages(prev => [...prev,
          { role: 'user', content: newMessage },
          { role: 'system', content: 'Sorry, there was an error processing your message. Please try again.' }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev,
        { role: 'user', content: newMessage },
        { role: 'system', content: 'Sorry, there was an error sending your message. Please check your connection and try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ 
        flex: 1, 
        mb: 2, 
        p: 2, 
        overflowY: 'auto',
        backgroundColor: '#000000',
        color: 'white',
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: '#1e1e1e'
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px'
        }
      }}>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{
              flexDirection: 'column',
              alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
              mb: 1
            }}>
              <Paper elevation={1} sx={{
                p: 2,
                backgroundColor: message.role === 'user' ? '#DC004E' : '#1E1E1E',
                color: 'white',
                maxWidth: '80%',
                borderRadius: '12px',
                position: 'relative'
              }}>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {message.content}
                    </Typography>
                  }
                />
              </Paper>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, backgroundColor: '#000000', borderTop: '1px solid #1E1E1E' }}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: '#1E1E1E'
                },
                '&:hover fieldset': {
                  borderColor: '#DC004E'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#DC004E'
                }
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            disabled={loading || !newMessage.trim()}
            sx={{
              backgroundColor: '#DC004E',
              '&:hover': {
                backgroundColor: '#b3003d'
              },
              '&:disabled': {
                backgroundColor: '#1E1E1E'
              }
            }}
          >
            Send
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ChatWindow;