import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Rating,
  Chip,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const LawyerCard = ({ lawyer, onRate, onViewDetails }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {lawyer.lawyer.name}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Rating
            value={lawyer.rating}
            precision={0.5}
            onChange={(event, newValue) => onRate(lawyer._id, newValue)}
          />
          <Typography variant="body2" color="text.secondary">
            ({lawyer.totalRatings} ratings)
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          {lawyer.areasOfPractice.map((area, index) => (
            <Chip
              key={index}
              label={area}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {lawyer.description}
        </Typography>

        <List dense>
          <ListItem>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText primary={lawyer.contactInfo.phone} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText primary={lawyer.lawyer.email} />
          </ListItem>
          {lawyer.contactInfo.address && (
            <ListItem>
              <ListItemIcon>
                <LocationIcon />
              </ListItemIcon>
              <ListItemText primary={lawyer.contactInfo.address} />
            </ListItem>
          )}
        </List>

        <Divider sx={{ my: 1 }} />

        <Typography variant="subtitle2" gutterBottom>
          Experience: {lawyer.experience} years
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Starting Charge: ${lawyer.startingCharge}/hour
        </Typography>
        <Typography variant="subtitle2">
          Languages: {lawyer.languages.join(', ')}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => onViewDetails(lawyer)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default LawyerCard;