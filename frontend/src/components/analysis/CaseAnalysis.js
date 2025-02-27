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
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Divider
} from '@mui/material';
import axios from 'axios';

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
      const response = await axios.post(
        'http://localhost:5000/api/analysis',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAnalysis(response.data.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
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

  const renderGauge = (value, label) => (
    <Box textAlign="center" mb={2}>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={value}
          size={80}
          thickness={4}
          color={value > 66 ? 'error' : value > 33 ? 'warning' : 'success'}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          right={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body2" component="div">
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2">{label}</Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Legal Case Analysis
        </Typography>

        <Card sx={{ mb: 4 }}>
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
                  >
                    {areasOfLaw.map((area) => (
                      <MenuItem key={area} value={area}>
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
                  >
                    {loading ? 'Analyzing...' : 'Analyze Case'}
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

        {analysis && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Risk Analysis
                  </Typography>
                  {renderGauge(analysis.analysis.riskLevel, 'Risk Level')}
                  {renderGauge(analysis.analysis.resolutionProbability, 'Resolution Probability')}
                  {renderGauge(analysis.analysis.complexity, 'Complexity')}
                  <Typography variant="body2">
                    Estimated Time: {analysis.analysis.timeEstimate}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Suggested Pro Bono Lawyers
                  </Typography>
                  <List>
                    {analysis.suggestedLawyers.map((lawyer, index) => (
                      <React.Fragment key={lawyer._id}>
                        <ListItem>
                          <ListItemText
                            primary={lawyer.lawyer?.name || 'Unknown Lawyer'}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  Experience: {lawyer.experience} years
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  Rating: {lawyer.rating}/5
                                </Typography>
                              </>
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

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Relevant Articles
                  </Typography>
                  <List>
                    {analysis.relevantArticles.map((article, index) => (
                      <React.Fragment key={article.articleNumber}>
                        <ListItem>
                          <ListItemText
                            primary={`${article.articleNumber} - ${article.title}`}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  {article.description}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  Relevance: {article.relevance}%
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {index < analysis.relevantArticles.length - 1 && <Divider />}
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
                      <React.Fragment key={step.stepNumber}>
                        <ListItem>
                          <ListItemText
                            primary={`Step ${step.stepNumber}: ${step.description}`}
                            secondary={`Estimated Time: ${step.estimatedTime}`}
                          />
                        </ListItem>
                        {index < analysis.steps.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default CaseAnalysis;