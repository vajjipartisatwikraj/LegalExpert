import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  LinearProgress,
  Paper
} from '@mui/material';

const AnalysisResult = ({ analysis }) => {
  const renderRiskGauge = (value, label) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>{label}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{value}%</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 15,
          borderRadius: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 10,
            backgroundColor: value > 66 ? '#f44336' : value > 33 ? '#ff9800' : '#4caf50',
            transition: 'transform 0.8s ease-in-out'
          }
        }}
      />
    </Box>
  );

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Card sx={{ 
          height: '100%',
          backgroundColor: '#1a1a1a',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          borderRadius: 3,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': { transform: 'translateY(-5px)' }
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600, color: '#fff' }}>
              Risk Analysis
            </Typography>
            {renderRiskGauge(analysis.riskLevel, 'Risk Level')}
            {renderRiskGauge(analysis.resolutionProbability, 'Resolution Probability')}
            {renderRiskGauge(analysis.complexity, 'Case Complexity')}
            
            <Box sx={{ mt: 4, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                Estimated Timeline
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {analysis.timeEstimate}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ 
          height: '100%',
          backgroundColor: '#1a1a1a',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          borderRadius: 3,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': { transform: 'translateY(-5px)' }
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600, color: '#fff' }}>
              Recommended Pro Bono Lawyers
            </Typography>
            <List sx={{ '& .MuiListItem-root': { py: 2 } }}>
              {analysis.suggestedLawyers.map((lawyer, index) => (
                <React.Fragment key={lawyer._id}>
                  <ListItem sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                    mb: 2
                  }}>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                          { (lawyer.lawyer?.name || 'Unknown Lawyer') + ` (${Number(lawyer.rating).toFixed(1)} ★)` }
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          {(lawyer.areasOfPractice || lawyer.lawyer?.areasOfPractice || []).map((area, i) => (
                            <Chip
                              key={i}
                              label={area}
                              size="medium"
                              sx={{ 
                                mr: 1,
                                mb: 1,
                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                color: '#4caf50',
                                '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.2)' }
                              }}
                            />
                          ))}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < analysis.suggestedLawyers.length - 1 && <Divider sx={{ my: 2 }} />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ 
          backgroundColor: '#1a1a1a',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          borderRadius: 3,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': { transform: 'translateY(-5px)' }
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600, color: '#fff' }}>
              Recommended Steps
            </Typography>
            <List>
              {analysis.steps.map((step, index) => (
                <ListItem key={index} sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  mb: 2,
                  p: 3
                }}>
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                        {index + 1}. {step.description}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Estimated time: {step.estimatedTime}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ 
          backgroundColor: '#1a1a1a',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          borderRadius: 3,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': { transform: 'translateY(-5px)' }
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600, color: '#fff' }}>
              Relevant Legal Articles
            </Typography>
            <List>
              {analysis.relevantArticles.map((article, index) => (
                <ListItem key={index} sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  mb: 2,
                  p: 3
                }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                          {article.title}
                        </Typography>
                        <Chip
                          label={`${article.relevance}% Relevant`}
                          size="medium"
                          sx={{
                            backgroundColor: article.relevance > 75 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                            color: article.relevance > 75 ? '#4caf50' : '#fff',
                            fontWeight: 500
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: '#bb86fc', mb: 1 }}>
                          Article {article.articleNumber}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {article.description}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AnalysisResult;