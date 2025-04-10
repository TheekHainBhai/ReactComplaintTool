import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      console.log('Fetching reviews for product:', productId);
      try {
        const response = await axios.get(`/api/reviews/product/${productId}`);
        console.log('Fetched reviews:', response.data);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [productId]);

  return (
    <div>
      <h2>Product Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review._id}>
              <h3>{review.review.title}</h3>
              <p>{review.review.content}</p>
              <p>Hygiene: {review.ratings.hygiene} | Safety: {review.ratings.safety} | Quality: {review.ratings.quality}</p>
              <p>Submitted by: {review.user.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;
