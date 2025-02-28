import React, { useState, useEffect } from 'react';
import './ProBonoList.css';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import LawyerCard from './LawyerCard';

const ProBonoList = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/probono', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setLawyers(data.data.probonoLawyers);
      } else {
        setError(data.message || 'Failed to fetch lawyers');
      }
    } catch (error) {
      setError('Error connecting to server');
      console.error('Error fetching lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRateLawyer = async (lawyerId, rating) => {
    try {
      const response = await fetch(`http://localhost:5000/api/probono/${lawyerId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rating })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setLawyers(prev =>
          prev.map(lawyer =>
            lawyer._id === lawyerId ? data.data.probonoLawyer : lawyer
          )
        );
      }
    } catch (error) {
      console.error('Error rating lawyer:', error);
    }
  };

  const filteredLawyers = lawyers.filter(lawyer => {
    if (!lawyer) return false;
    
    const lawyerName = lawyer.name || lawyer.lawyer?.name || '';
    const matchesSearch = 
      lawyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lawyer.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lawyer.areasOfPractice || []).some(area =>
        area.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesDomain = 
      selectedDomain === 'all' ||
      (lawyer.areasOfPractice || []).includes(selectedDomain);
    
    return matchesSearch && matchesDomain;
  });

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
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Pro Bono Lawyers
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#000000', color: 'white' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search lawyers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon sx={{ color: 'white' }} />,
                sx: { color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }
              }}
              InputLabelProps={{ sx: { color: 'white' } }}
              sx={{ '& .MuiInputBase-input': { color: 'white' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'white' }}>Legal Domain</InputLabel>
              <Select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                label="Legal Domain"
                sx={{ 
                  color: 'white !important',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  '& .MuiSvgIcon-root': { color: 'white' }
                }}
              >
                <MenuItem value="all">All Domains</MenuItem>
                {legalDomains.map((domain) => (
                  <MenuItem key={domain} value={domain} sx={{ 
                    color: 'white',
                    backgroundColor:'black',
                  }}>
                    {domain}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredLawyers.map((lawyer) => (
          <Grid item xs={12} md={6} lg={4} key={lawyer._id}>
            <LawyerCard
              lawyer={lawyer}
              onRate={handleRateLawyer}
              onViewDetails={() => {
                setSelectedLawyer(lawyer);
                setDialogOpen(true);
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedLawyer && (
          <>
            <DialogTitle>
              {selectedLawyer.name || selectedLawyer.lawyer?.name || 'Unknown Lawyer'}
              {selectedLawyer.lawyer?.lawyerProfile?.domains?.length > 0 && (
                <Typography variant="subtitle1" color="textSecondary">
                  {selectedLawyer.lawyer.lawyerProfile.domains[0]}
                </Typography>
              )}
            </DialogTitle>
            <DialogContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Contact Information"
                    secondary={
                      <Box mt={1}>
                        {selectedLawyer.contactInfo.phone && (
                          <Box display="flex" alignItems="center" mb={1}>
                            <PhoneIcon sx={{ mr: 1 }} />
                            {selectedLawyer.contactInfo.phone}
                          </Box>
                        )}
                        {selectedLawyer.contactInfo.email && (
                          <Box display="flex" alignItems="center" mb={1}>
                            <EmailIcon sx={{ mr: 1 }} />
                            {selectedLawyer.contactInfo.email}
                          </Box>
                        )}
                        {selectedLawyer.contactInfo.address && (
                          <Box display="flex" alignItems="center">
                            <LocationIcon sx={{ mr: 1 }} />
                            {selectedLawyer.contactInfo.address}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Languages"
                    secondary={
                      <Box mt={1}>
                        {selectedLawyer.languages.map((lang) => (
                          <Chip
                            key={lang}
                            label={lang}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Certifications"
                    secondary={
                      <List dense>
                        {selectedLawyer.certifications.map((cert, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={cert.name}
                              secondary={`${cert.issuer} (${cert.year})`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Statistics"
                    secondary={
                      <Box mt={1}>
                        <Typography variant="body2">
                          Success Rate: {selectedLawyer.successRate}%
                        </Typography>
                        <Typography variant="body2">
                          Cases Handled: {selectedLawyer.casesHandled}
                        </Typography>
                        <Typography variant="body2">
                          Availability: {selectedLawyer.availability}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ProBonoList;