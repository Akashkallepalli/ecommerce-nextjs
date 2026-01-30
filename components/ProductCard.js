import Link from 'next/link';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        alert('Added to cart!');
      } else {
        alert('Please sign in first');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
      data-testid={`product-card-${product.id}`}
    >
      <Link href={`/products/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90"
          data-testid={`product-image-${product.id}`}
        />
      </Link>

      <h3
        className="mt-4 text-lg font-semibold text-gray-900"
        data-testid={`product-name-${product.id}`}
      >
        {product.name}
      </h3>

      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
        {product.description}
      </p>

      <div className="mt-4 flex justify-between items-center">
        <span
          className="text-xl font-bold text-blue-600"
          data-testid={`product-price-${product.id}`}
        >
          ${product.price}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          data-testid={`add-to-cart-${product.id}`}
        >
          {loading ? '...' : 'Add'}
        </button>
      </div>
    </div>
  );
}

