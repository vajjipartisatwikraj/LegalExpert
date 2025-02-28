import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Rating,
  Chip,
  Box
} from '@mui/material';

const LawyerCard = ({ lawyer, onRate, onViewDetails }) => {
  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
      color: 'white',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
          {lawyer.name || lawyer.lawyer?.name || "Name Not Available"}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Rating
            value={lawyer.rating}
            precision={0.5}
            onChange={(event, newValue) => onRate(lawyer._id, newValue)}
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#DC004E'
              },
              '& .MuiRating-iconEmpty': {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          />
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            ({lawyer.totalRatings} ratings)
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          {lawyer.areasOfPractice.map((area, index) => (
            <Chip
              key={index}
              label={area}
              size="small"
              sx={{
                mr: 0.5,
                mb: 0.5,
                backgroundColor: 'rgba(220, 0, 78, 0.1)',
                color: '#DC004E',
                borderRadius: '16px',
                '&:hover': {
                  backgroundColor: 'rgba(220, 0, 78, 0.2)'
                }
              }}
            />
          ))}
        </Box>

        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} paragraph>
          {lawyer.description}
        </Typography>

        {lawyer.startingCharge === 0 || !lawyer.startingCharge ? (
          <Chip
            label="Public Service"
            size="small"
            sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              color: '#4caf50',
              mb: 1,
              borderRadius: '16px',
              '&:hover': {
                backgroundColor: 'rgba(76, 175, 80, 0.2)'
              }
            }}
          />
        ) : (
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'white' }}>
            Starting Charge: ₹{lawyer.startingCharge}/hour
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <Button
          size="small"
          sx={{
            backgroundColor: '#DC004E',
            color: 'white',
            '&:hover': {
              backgroundColor: '#b3003d',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease-in-out',
            borderRadius: '20px',
            px: 3
          }}
          onClick={() => onViewDetails(lawyer)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default LawyerCard;