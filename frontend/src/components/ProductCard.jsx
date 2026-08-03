import React from 'react';

function ProductCard({ product }) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', width: '180px' }}>
      <h3>{product.name}</h3>
      <p>${Number(product.price).toFixed(2)}</p>
    </div>
  );
}

export default ProductCard;
