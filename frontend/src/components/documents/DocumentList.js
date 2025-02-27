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
const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/documents', {
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
      const response = await fetch(`http://localhost:5000/api/documents/${selectedDocument._id}`, {
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
      const response = await fetch('http://localhost:5000/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.status === 'success') {
        setDocuments(prev => [data.data.document, ...prev]);
        return true;
      } else {
        throw new Error(data.message || 'Failed to create document');
      }
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  };

  const handleDownloadPDF = async (documentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/documents/${documentId}/pdf`, {
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
      <Box  display="flex" justifyContent="space-between" alignItems="center" mb={3} width={'100%'}>
        <Typography variant="h4" component="h1" sx={{color:'white'}}>
          Legal Documents
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DocumentIcon />}
          onClick={() => setDialogOpen(true)}
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
            <Paper key={document._id} sx={{ mb: 2, backgroundColor: '#000000', '&:hover': { backgroundColor: '#e9ecef', transform: 'translateY(-2px)', transition: 'all 0.3s ease-in-out' } }}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="download"
                      onClick={() => handleDownloadPDF(document._id)}
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
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={document.title}
                  secondary={
                    <React.Fragment>
                      <Box component="div">
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
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