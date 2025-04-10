import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Rating,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const ProductReviewPage = () => {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    hygiene: 3,
    safety: 3,
    quality: 3,
    title: '',
    content: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/product/${productId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('productId', productId);
      formDataToSend.append('productName', 'Product'); 
      formDataToSend.append('hygiene', formData.hygiene);
      formDataToSend.append('safety', formData.safety);
      formDataToSend.append('quality', formData.quality);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('review', formData.content);
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await axios.post('/api/reviews', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setReviews([response.data, ...reviews]);
      setFormData({
        hygiene: 3,
        safety: 3,
        quality: 3,
        title: '',
        content: ''
      });
      setSelectedImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Rate & Review Product
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Product Ratings
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography>Hygiene Rating</Typography>
              <Rating
                name="hygiene"
                value={formData.hygiene}
                onChange={(e, value) => handleRatingChange('hygiene', value)}
                precision={1}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography>Safety Rating</Typography>
              <Rating
                name="safety"
                value={formData.safety}
                onChange={(e, value) => handleRatingChange('safety', value)}
                precision={1}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography>Quality Rating</Typography>
              <Rating
                name="quality"
                value={formData.quality}
                onChange={(e, value) => handleRatingChange('quality', value)}
                precision={1}
              />
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Review Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Review"
            value={formData.content}
            onChange={(e) => handleChange(e)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedImage(file);
                setPreviewUrl(file ? URL.createObjectURL(file) : null);
              }}
            />
            <label htmlFor="raised-button-file">
              <Button variant="outlined" component="span" fullWidth>
                Upload Image
              </Button>
            </label>
            {previewUrl && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                />
              </Box>
            )}
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Submit Review
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          User Reviews
        </Typography>

        <List>
          {reviews.map((review) => (
            <React.Fragment key={review._id}>
              <ListItem>
                <Avatar>
                  {review.user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={review.review.title}
                  secondary={review.review.content}
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Rating value={review.ratings.hygiene} readOnly precision={1} size="small" />
                    <Rating value={review.ratings.safety} readOnly precision={1} size="small" />
                    <Rating value={review.ratings.quality} readOnly precision={1} size="small" />
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          {reviews.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
              No reviews yet. Be the first to review!
            </Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default ProductReviewPage;
