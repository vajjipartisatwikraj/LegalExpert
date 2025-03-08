import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, List, ListItem, ListItemText, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import './chat.css';

const handleTranslation = async (text, targetLang) => {
  try {
    // Input validation
    if (!text || !targetLang) {
      throw new Error('Missing required translation parameters');
    }

    // Using Google Translate API directly
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    
    if (!response.ok) {
      const errorMessage = `Translation request failed with status: ${response.status}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    if (!data || !data[0]) {
      const errorMessage = 'Invalid translation response format';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    // Extract and combine all translated segments
    const translatedText = data[0]
      .filter(segment => segment && segment[0])
      .map(segment => segment[0])
      .join('');
    
    if (!translatedText) {
      const errorMessage = 'Translation returned empty result';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    console.log(`Successfully translated text to ${targetLang}`);
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(`Translation failed: ${error.message}`);
  }
};

const ChatWindow = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (chatId) {
      fetchChatHistory();
    }
  }, [chatId]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chats`, {
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

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chats/${chatId}/messages`, {
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
          { role: 'user', content: newMessage, timestamp: new Date().toISOString() },
          { role: 'assistant', content: data.data.message, timestamp: new Date().toISOString() }
        ]);
        setNewMessage('');
      } else {
        console.error('Error from server:', data.message);
        setMessages(prev => [...prev,
          { role: 'user', content: newMessage, timestamp: new Date().toISOString() },
          { role: 'system', content: 'Sorry, there was an error processing your message. Please try again.', timestamp: new Date().toISOString() }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev,
        { role: 'user', content: newMessage, timestamp: new Date().toISOString() },
        { role: 'system', content: 'Sorry, there was an error sending your message. Please check your connection and try again.', timestamp: new Date().toISOString() }
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
                position: 'relative',
                display:'flex',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                          {message.content}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          {formatTimestamp(message.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper elevation={3} sx={{ 
        p: 2, 
        backgroundColor: '#000000', 
        borderTop: '1px solid #1E1E1E',
        position: 'fixed',
        bottom: 0,
        left: '250px',
        right: 0,
        zIndex: 1000
      }}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8, maxWidth: '1200px', margin: '0 auto' }}>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatWindow;