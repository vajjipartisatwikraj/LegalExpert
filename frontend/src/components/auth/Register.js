import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'public',
    lawyerProfile: {
      experience: 0,
      domains: [],
      charges: 0
    }
  });
  const [error, setError] = useState('');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('lawyerProfile.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        lawyerProfile: {
          ...prev.lawyerProfile,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDomainsChange = (event) => {
    setFormData(prev => ({
      ...prev,
      lawyerProfile: {
        ...prev.lawyerProfile,
        domains: event.target.value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields for lawyer role
      if (formData.role === 'lawyer') {
        if (!formData.lawyerProfile.experience || formData.lawyerProfile.experience < 0) {
          setError('Please provide valid years of experience');
          return;
        }
        if (!formData.lawyerProfile.domains || formData.lawyerProfile.domains.length === 0) {
          setError('Please select at least one legal domain');
          return;
        }
        if (!formData.lawyerProfile.charges || formData.lawyerProfile.charges < 0) {
          setError('Please provide valid charges per hour');
          return;
        }
      }

      const requestData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: formData.role
      };

      if (formData.role === 'lawyer') {
        requestData.lawyerProfile = {
          experience: parseInt(formData.lawyerProfile.experience),
          domains: formData.lawyerProfile.domains,
          charges: parseInt(formData.lawyerProfile.charges),
          solvedCases: 0,
          ratings: [],
          averageRating: 0
        };
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        window.location.reload();
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#000000'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#1E1E1E',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white', mb: 3 }}>
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#ff5252' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)'
                },
                '&:hover fieldset': {
                  borderColor: '#DC004E'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#DC004E'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#DC004E'
              },
              mb: 2
            }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)'
                },
                '&:hover fieldset': {
                  borderColor: '#DC004E'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#DC004E'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#DC004E'
              },
              mb: 2
            }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)'
                },
                '&:hover fieldset': {
                  borderColor: '#DC004E'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#DC004E'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#DC004E'
              },
              mb: 2
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="passwordConfirm"
            type="password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)'
                },
                '&:hover fieldset': {
                  borderColor: '#DC004E'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#DC004E'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#DC004E'
              },
              mb: 2
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              backgroundColor: '#DC004E',
              '&:hover': {
                backgroundColor: '#b3003d'
              },
              fontSize: '1rem'
            }}
          >
            Register
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'white'
              }
            }}
          >
            Already have an account? Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;