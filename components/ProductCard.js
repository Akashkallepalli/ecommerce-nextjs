import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!session) {
      router.push('/api/auth/signin?callbackUrl=/cart');
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (res.ok) {
        alert('Added to cart!');
      } else {
        alert('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div
        data-testid={`product-card-${product.id}`}
        className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
      >
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-lg text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <button
            data-testid={`add-to-cart-button-${product.id}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
