import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Rating,
  Box,
  Typography
} from '@mui/material';

const SimpleReviewForm = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    hygiene: 3,
    quality: 3,
    review: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      productId: '',
      productName: '',
      hygiene: 3,
      quality: 3,
      review: ''
    });
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate all required fields
      const requiredFields = {
        productId: 'Product ID',
        productName: 'Product Name',
        review: 'Review Text'
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !formData[key])
        .map(([_, label]) => label);

      if (missingFields.length > 0) {
        alert(`Please fill in: ${missingFields.join(', ')}`);
        return;
      }

      // Validate ratings
      if (!formData.hygiene || !formData.quality) {
        alert('Please provide both Hygiene and Quality ratings');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('productId', formData.productId.trim());
      formDataToSend.append('productName', formData.productName.trim());
      formDataToSend.append('hygiene', formData.hygiene);
      formDataToSend.append('quality', formData.quality);
      formDataToSend.append('review', formData.review.trim());
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      console.log('Submitting review with image:', selectedImage ? 'Yes' : 'No');
      
      const response = await fetch('http://localhost:5002/api/reviews', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        let errorMessage = 'Failed to submit review';
        
        if (data.message) {
          errorMessage = data.message;
        } else if (data.errors) {
          errorMessage = Object.values(data.errors).join('\n');
        } else if (data.error) {
          errorMessage = data.error;
        }
        
        throw new Error(errorMessage);
      }
      
      if (data.success) {
        alert(data.message || 'Review submitted successfully!');
        handleClose();
      } else {
        throw new Error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.message || 'Network error. Please check if the server is running.');
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Rate & Review Product
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Product Review</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              fullWidth
              label="Product ID"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
            />

            <TextField
              margin="normal"
              fullWidth
              label="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
            />

            <Box sx={{ my: 2 }}>
              <Typography component="legend">Hygiene Rating</Typography>
              <Rating
                name="hygiene"
                value={formData.hygiene}
                onChange={(_, value) => handleChange({ target: { name: 'hygiene', value: value || 3 } })}
                precision={1}
                size="large"
              />
            </Box>

            <Box sx={{ my: 2 }}>
              <Typography component="legend">Quality Rating</Typography>
              <Rating
                name="quality"
                value={formData.quality}
                onChange={(_, value) => handleChange({ target: { name: 'quality', value: value || 3 } })}
                precision={1}
                size="large"
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Review"
              name="review"
              value={formData.review}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Box sx={{ mt: 2, mb: 2 }}>
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
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">Submit Review</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SimpleReviewForm;
