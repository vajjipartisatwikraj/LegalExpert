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
  LinearProgress
} from '@mui/material';

const AnalysisResult = ({ analysis }) => {
  const renderRiskGauge = (value, label) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2">{label}</Typography>
        <Typography variant="subtitle2">{value}%</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            backgroundColor: value > 66 ? '#f44336' : value > 33 ? '#ff9800' : '#4caf50'
          }
        }}
      />
    </Box>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Risk Analysis
            </Typography>
            {renderRiskGauge(analysis.riskLevel, 'Risk Level')}
            {renderRiskGauge(analysis.resolutionProbability, 'Resolution Probability')}
            {renderRiskGauge(analysis.complexity, 'Case Complexity')}
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Estimated Timeline
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {analysis.timeEstimate}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recommended Pro Bono Lawyers
            </Typography>
            <List>
              {analysis.suggestedLawyers.map((lawyer, index) => (
                <React.Fragment key={lawyer._id}>
                  <ListItem>
                    <ListItemText
                      primary={lawyer.name}
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          {lawyer.areasOfPractice.map((area, i) => (
                            <Chip
                              key={i}
                              label={area}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < analysis.suggestedLawyers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recommended Steps
            </Typography>
            <List>
              {analysis.steps.map((step, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {index + 1}. {step.description}
                      </Typography>
                    }
                    secondary={`Estimated time: ${step.estimatedTime}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Relevant Legal Articles
            </Typography>
            <List>
              {analysis.relevantArticles.map((article, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {article.title}
                        </Typography>
                        <Chip
                          label={`${article.relevance}% Relevant`}
                          size="small"
                          color={article.relevance > 75 ? 'success' : 'default'}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Article {article.articleNumber}
                        </Typography>
                        {` — ${article.description}`}
                      </>
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