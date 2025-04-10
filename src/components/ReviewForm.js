import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ productId }) => {
  const [formData, setFormData] = useState({
    hygiene: 3,
    safety: 3,
    quality: 3,
    title: '',
    content: '',
    status: 'pending'
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('productId', productId);
      formDataToSend.append('hygiene', formData.hygiene);
      formDataToSend.append('quality', formData.quality);
      formDataToSend.append('safety', formData.safety);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('review', formData.content);
      formDataToSend.append('status', formData.status);
      
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const review = await axios.post('/api/reviews', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Review submitted successfully:', review);
      alert('Review submitted successfully!');
      
      // Reset form
      setFormData({
        hygiene: 3,
        safety: 3,
        quality: 3,
        title: '',
        content: '',
        status: 'pending'
      });
      setSelectedImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Submit a Review</h2>
      <div>
        <label>Hygiene Rating:</label>
        <input type="number" name="hygiene" min="1" max="5" value={formData.hygiene} onChange={handleChange} />
      </div>
      <div>
        <label>Safety Rating:</label>
        <input type="number" name="safety" min="1" max="5" value={formData.safety} onChange={handleChange} />
      </div>
      <div>
        <label>Quality Rating:</label>
        <input type="number" name="quality" min="1" max="5" value={formData.quality} onChange={handleChange} />
      </div>
      <div>
        <label>Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} />
      </div>
      <div>
        <label>Content:</label>
        <textarea name="content" value={formData.content} onChange={handleChange}></textarea>
      </div>
      <div>
        <label>Status:</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div>
        <label>Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ marginBottom: '10px' }}
        />
        {previewUrl && (
          <div style={{ marginTop: '10px' }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ReviewForm;
