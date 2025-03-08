import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  IconButton,
  Button,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Description as DocumentIcon,
  GetApp as DownloadIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import DocumentDialog from './DocumentDialog';
import DocumentEditDialog from './DocumentEditDialog';
import './documents.css'
import api from '../../services/api';
const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setDocuments(data.data.documents);
      } else {
        setError(data.message || 'Failed to fetch documents');
      }
    } catch (error) {
      setError('Error connecting to server');
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDocument = async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents/${selectedDocument._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.status === 'success') {
        setDocuments(prev => prev.map(doc =>
          doc._id === selectedDocument._id ? data.data.document : doc
        ));
        return true;
      } else {
        throw new Error(data.message || 'Failed to update document');
      }
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  };

  const handleCreateDocument = async (formData) => {
    try {
      // Validate required fields
      if (!formData.title || !formData.type || !formData.description || !formData.legalDomain) {
        throw new Error('Please fill in all required fields');
      }

      // Format the request body
      const documentData = {
        title: formData.title.trim(),
        type: formData.type,
        description: formData.description.trim(),
        legalDomain: formData.legalDomain
      };

      const response = await api.post('/api/documents', documentData);

      if (response.data.status === 'success') {
        setDocuments(prev => [response.data.data.document, ...prev]);
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to create document');
      }
    } catch (error) {
      console.error('Error creating document:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create document';
      throw new Error(errorMessage);
    }
  };

  const handleDownloadPDF = async (documentId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents/${documentId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // You might want to show a notification to the user here
    }
  };

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
    <Box width={'100%'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, width: '100%' }}>
        <Typography variant="h4" component="h1" sx={{ color: 'white', fontFamily: 'Nekst-SemiBold' }}>
          My Documents
        </Typography>
        <Button
          variant="contained"
          startIcon={<DocumentIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{
            bgcolor: '#BB0202',
            '&:hover': { bgcolor: '#8B0000' },
            fontFamily: 'Nekst-Medium'
          }}
        >
          Create New Document
        </Button>
      </Box>

      {documents.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{color:'#fff'}}>
            No documents found. Create your first legal document!
          </Typography>
        </Paper>
      ) : (
        <List>
          {documents.map((document) => (
            <Paper key={document._id} sx={{ 
                mb: 2, 
                backgroundColor: '#000000',
                border: '0.1px solid rgb(31, 31, 31) !important', 
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { 
                  backgroundColor: '#000000', 
                  transform: 'translateY(-4px)', 
                  boxShadow: '0 4px 20px rgba(187, 2, 2, 0.1)',
                  transition: 'all 0.3s ease-in-out' 
                } 
              }}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="download"
                      onClick={() => handleDownloadPDF(document._id)}
                      sx={{
                        color: 'white',
                        paddingRight:'30px'
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => {
                        setSelectedDocument(document);
                        setEditDialogOpen(true);
                      }}
                      sx={{
                        color: 'white',
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  sx={{fontSize:'30px'}}
                  primary={document.title}
                  secondary={
                    <React.Fragment>
                      <Box component="div">
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                          sx={{
                            fontSize:'15px'
                          }}
                        >
                          {document.description}
                        </Typography>
                      </Box>
                      <Box mt={1}>
                        <Chip
                          label={document.type}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={document.legalDomain}
                          size="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={document.status}
                          size="small"
                          color={document.status === 'draft' ? 'warning' : 'success'}
                        />
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      <DocumentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateDocument}
      />

      <DocumentEditDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onSubmit={handleEditDocument}
      />
    </Box>
  );
};

export default DocumentList;