import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import './analysis.css';
import AnalysisResult from './AnalysisResult';

const areasOfLaw = [
  'Criminal',
  'Civil',
  'Corporate',
  'Family',
  'Intellectual Property',
  'Tax',
  'Other'
];

const CaseAnalysis = () => {
  const [formData, setFormData] = useState({
    problemDescription: '',
    areaOfLaw: ''
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const analysisResponse = await axios.post(
        'http://localhost:5000/api/analysis',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Analysis Response:', analysisResponse.data);
      console.log('Analysis Data:', analysisResponse.data.data.analysis);
      setAnalysis(analysisResponse.data.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Analysis Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };



  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Legal Case Analysis
        </Typography>

        <Card sx={{ mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.01)' } }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="problemDescription"
                    label="Describe your legal problem"
                    value={formData.problemDescription}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)'
                      },
                      '& .MuiInputBase-input': {
                        color: 'white'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    name="areaOfLaw"
                    label="Area of Law"
                    value={formData.areaOfLaw}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2'
                        }
                      },
                      '& .MuiSelect-select': {
                        color: 'white'
                      },
                      '& .MuiSelect-icon': {
                        color: 'rgba(255, 255, 255, 0.7)'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    }}
                  >
                    {areasOfLaw.map((area) => (
                      <MenuItem 
                        key={area} 
                        value={area}
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          color: 'white !important',
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)'
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(25, 118, 210, 0.15)'
                          }
                        }}
                      >
                        {area}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress
                          size={24}
                          sx={{
                            color: 'white',
                            position: 'absolute',
                            left: '50%',
                            marginLeft: '-12px'
                          }}
                        />
                        <span style={{ opacity: 0 }}>Analyzing...</span>
                      </>
                    ) : (
                      'Analyze Case'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}

        {analysis && <AnalysisResult analysis={analysis} />}
      </Box>
    </Container>
  );
};

export default CaseAnalysis;