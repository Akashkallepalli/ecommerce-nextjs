import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';

export default function AddToCartButton({ productId, quantity = 1, disabled = false }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!session) {
      signIn('github', { callbackUrl: `/products/${productId}` });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
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
      setIsLoading(false);
    }
  };

  return (
    <button
      data-testid="add-to-cart-button"
      onClick={handleClick}
      disabled={disabled || isLoading}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
