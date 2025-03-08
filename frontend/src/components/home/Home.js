import React, { useState, useEffect } from 'react';
import './Home.css'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  Chat as ChatIcon,
  Description as DocumentIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Home = () => {
  const [recentDocs, setRecentDocs] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      const [docsResponse, chatsResponse] = await Promise.all([
        api.get('/api/documents', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        api.get('/api/chats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      const docsData = await docsResponse.json();
      const chatsData = await chatsResponse.json();

      if (docsData.status === 'success' && chatsData.status === 'success') {
        setRecentDocs(docsData.data.documents.slice(0, 3));
        setRecentChats(chatsData.data.chats.slice(0, 3));
      } else {
        setError('Failed to fetch recent activities');
      }
    } catch (error) {
      setError('Error connecting to server');
      console.error('Error fetching recent activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const QuickActionButton = ({ icon, label, onClick }) => (
    <Button
      variant="contained"
      startIcon={icon}
      onClick={onClick}
      sx={{
        backgroundColor: '#000000',
        py: 2,
        width: '100%',
        height: '130%',
        display: 'flex',
        flexDirection: 'column',
        border: '2px dashed #DC004E',
        gap: 1
      }}
    >
      {label}
    </Button>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box  width="100%" sx={{ display: "flex", alignItems: "center",flexDirection: 'column', justifyContent: "center", height: "130vh", gap: '120px'}}>
      <Typography  variant="h4" component="h1" gutterBottom >
        <span className="heading6">Welcome to <span className="heading1 highlighted">LegalExpert.AI</span></span>
      </Typography>

      <Grid  container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <QuickActionButton className='intial-btns' 
            icon={<ChatIcon />}
            label="Quick Chat"
            onClick={() => navigate('/chats')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickActionButton
            icon={<DocumentIcon />}
            label="Quick Document"
            onClick={() => navigate('/documents')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickActionButton
            icon={<GroupIcon />}
            label="Find Pro Bono Lawyer"
            onClick={() => navigate('/probono')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, backgroundColor: '#000000', color: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Recent Documents
            </Typography>
            <Stack spacing={2}>
              {recentDocs.length > 0 ? (
                recentDocs.map((doc) => (
                  <Card key={doc._id} sx={{
                    cursor: 'pointer',
                    backgroundColor: '#1E1E1E',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#2C2C2C',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease-in-out'
                    }
                  }} onClick={() => navigate('/documents')}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ color: 'white' }}>{doc.title}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={doc.type}
                          size="small"
                          sx={{ mr: 1, backgroundColor: '#DC004E', color: 'white' }}
                        />
                        <Chip
                          label={doc.legalDomain}
                          size="small"
                          sx={{ backgroundColor: '#1E1E1E', color: 'white' }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  No recent documents
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, backgroundColor: '#000000', color: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Recent Chats
            </Typography>
            <Stack spacing={2}>
              {recentChats.length > 0 ? (
                recentChats.map((chat) => (
                  <Card key={chat._id} sx={{
                    cursor: 'pointer',
                    backgroundColor: '#1E1E1E',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#2C2C2C',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease-in-out'
                    }
                  }} onClick={() => navigate(`/chats/${chat._id}`)}>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ color: 'white' }}>{chat.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {chat.legalDomain}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  No recent chats
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;