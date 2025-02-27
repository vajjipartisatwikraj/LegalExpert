import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DocumentEditDialog = ({ open, onClose, document, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const quillRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    legalDomain: '',
    content: ''
  });

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || '',
        type: document.type || '',
        description: document.description || '',
        legalDomain: document.legalDomain || '',
        content: document.content || ''
      });
    }
  }, [document]);

  const documentTypes = [
    'Agreement',
    'Notice',
    'Request',
    'Affidavit',
    'Petition',
    'Other'
  ];

  const legalDomains = [
    'Criminal',
    'Civil',
    'Corporate',
    'Family',
    'Intellectual Property',
    'Tax',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error updating document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {document ? 'Edit Document' : 'Create New Document'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Edit" />
            <Tab label="Preview" />
          </Tabs>
        </Box>

        {activeTab === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="title"
              label="Document Title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Document Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Document Type"
              >
                {documentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Legal Domain</InputLabel>
              <Select
                name="legalDomain"
                value={formData.legalDomain}
                onChange={handleChange}
                label="Legal Domain"
              >
                {legalDomains.map((domain) => (
                  <MenuItem key={domain} value={domain}>
                    {domain}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
              required
            />
            <Box sx={{ height: '400px', mb: 2 }}>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                style={{ height: '350px' }}
                placeholder="Enter your document content here..."
              />
            </Box>
          </Box>
        ) : (
          <Paper sx={{ p: 3, minHeight: '60vh', overflowY: 'auto' }}>
            <Typography variant="h5" gutterBottom>
              {formData.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Type: {formData.type} | Domain: {formData.legalDomain}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {formData.description}
            </Typography>
            <Box
              sx={{ mt: 3 }}
              dangerouslySetInnerHTML={{ __html: formData.content }}
            />
          </Paper>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.title || !formData.type || !formData.legalDomain || !formData.description || !formData.content}
        >
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentEditDialog;