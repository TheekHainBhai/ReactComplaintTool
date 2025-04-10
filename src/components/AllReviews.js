import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Box,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import axios from 'axios';

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/reviews');
      console.log('Reviews response:', response.data);
      if (response.data.success) {
        setReviews(response.data.reviews);
      } else {
        setError('Failed to fetch reviews: ' + response.data.message);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.response?.data?.message || 'Failed to fetch reviews. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Product Reviews
      </Typography>
      <Grid container spacing={3}>
        {reviews.map((review) => (
          <Grid item xs={12} sm={6} md={4} key={review._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {review.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={review.image.startsWith('http') ? review.image : `http://localhost:5002${review.image}`}
                  alt={`Review for ${review.productName}`}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {review.productName}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography component="div" variant="body2" color="text.secondary">
                    Hygiene Rating
                  </Typography>
                  <Rating value={review.hygiene} readOnly precision={1} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography component="div" variant="body2" color="text.secondary">
                    Quality Rating
                  </Typography>
                  <Rating value={review.quality} readOnly precision={1} />
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  {review.review}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AllReviews;
