import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductReviewPage from '../components/ProductReviewPage';

const ReviewRoutes = () => {
  return (
    <Routes>
      <Route path="/reviews/:productId" element={<ProductReviewPage />} />
    </Routes>
  );
};

export default ReviewRoutes;
