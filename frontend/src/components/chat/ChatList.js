import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newChat, setNewChat] = useState({
    title: '',
    legalDomain: ''
  });
  const navigate = useNavigate();

  const legalDomains = [
    'Criminal',
    'Civil',
    'Corporate',
    'Family',
    'Intellectual Property',
    'Tax',
    'Other'
  ];

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setChats(data.data.chats);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const handleCreateChat = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newChat)
      });

      const data = await response.json();
      if (data.status === 'success') {
        setChats(prev => [data.data.chat, ...prev]);
        setDialogOpen(false);
        setNewChat({ title: '', legalDomain: '' });
        navigate(`/chats/${data.data.chat._id}`);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', margin: '0px'}}>      
        <Paper elevation={3} sx={{ p: 2, mb: 2, backgroundColor: '#000000', color: 'white' }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ 
              backgroundColor: '#000000',
              color: 'white',
              border: '2px dashed #DC004E',
              '&:hover': {
                backgroundColor: 'rgba(220, 0, 78, 0.08)',
              }
            }}
          >
            New Chat
          </Button>
        </Paper>

        <Paper elevation={3} sx={{ flex: 1, overflow: 'hidden', backgroundColor: '#000000', color: 'white' }}>
          <List sx={{ height: '100%', overflowY: 'auto', p: 2 }}>
            {chats.map((chat) => (
              <ListItem
                key={chat._id}
                button
                onClick={() => navigate(`/chats/${chat._id}`)}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  backgroundColor: '#000000',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease-in-out'
                  }
                }}
              >
                <ListItemText
                  primary={<Typography sx={{ color: 'white' }}>{chat.title}</Typography>}
                  secondary={
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {chat.legalDomain} - Risk Level: {chat.riskLevel}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Start New Chat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Chat Title"
            fullWidth
            value={newChat.title}
            onChange={(e) => setNewChat(prev => ({ ...prev, title: e.target.value }))}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Legal Domain</InputLabel>
            <Select
              value={newChat.legalDomain}
              onChange={(e) => setNewChat(prev => ({ ...prev, legalDomain: e.target.value }))}
              label="Legal Domain"
            >
              {legalDomains.map((domain) => (
                <MenuItem key={domain} value={domain}>
                  {domain}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateChat}
            disabled={!newChat.title || !newChat.legalDomain}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatList;