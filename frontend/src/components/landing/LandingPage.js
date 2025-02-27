import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import ChatIcon from '@mui/icons-material/Chat';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';

const LandingPage = () => {
  const theme = useTheme();

  const features = [
    {
      title: 'AI-Powered Legal Analysis',
      description: 'Get instant risk assessment and case analysis using advanced AI technology',
      icon: <GavelIcon sx={{ fontSize: 40 }} />
    },
    {
      title: 'Smart Document Generation',
      description: 'Create professional legal documents with AI assistance',
      icon: <DescriptionIcon sx={{ fontSize: 40 }} />
    },
    {
      title: 'Pro Bono Lawyer Network',
      description: 'Connect with experienced pro bono lawyers in various legal domains',
      icon: <GroupIcon sx={{ fontSize: 40 }} />
    },
    {
      title: 'Legal Chat Assistant',
      description: 'Get instant answers to your legal questions 24/7',
      icon: <ChatIcon sx={{ fontSize: 40 }} />
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#000000', borderBottom: '1px solid #1E1E1E' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/legalExpertai-logo.png"
              alt="LegalExpert.AI Logo"
              style={{ height: '30px', marginRight: '10px' }}
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
              LegalExpert.AI
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: '#DC004E',
                  backgroundColor: 'rgba(220, 0, 78, 0.08)'
                }
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                backgroundColor: '#DC004E',
                '&:hover': {
                  backgroundColor: '#b3003d'
                }
              }}
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 8 }}>
        {/* Hero Section */}
        <Box
          sx={{
            pt: 8,
            pb: 6,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            color: 'white'
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  component="h1"
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    mb: 4
                  }}
                >
                  LegalExpert.AI
                </Typography>
                <Typography variant="h5" sx={{ mb: 4 }}>
                  Your AI-Powered Legal Assistant for Smart Case Analysis and Professional Guidance
                </Typography>
                <Box sx={{ '& button': { mr: 2, mb: 2 } }}>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: '#DC004E',
                      '&:hover': {
                        backgroundColor: '#b3003d'
                      }
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="large"
                    sx={{ borderRadius: 2, color: 'white', borderColor: 'white' }}
                  >
                    Login
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src="/legalExpertai-logo.png"
                  alt="LegalExpert.AI"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto',
                    display: 'block',
                    margin: 'auto'
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Container sx={{ py: 8 }} maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            Our Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: theme.palette.background.paper,
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10]
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography gutterBottom variant="h5" component="h3">
                      {feature.title}
                    </Typography>
                    <Typography color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Call to Action */}
        <Box
          sx={{
            bgcolor: theme.palette.primary.main,
            color: 'white',
            py: 8,
            textAlign: 'center'
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              Join LegalExpert.AI today and experience the future of legal assistance
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ borderRadius: 2 }}
            >
              Create Free Account
            </Button>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;