import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import CartItemComponent from '@/components/CartItem';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (res.status === 401) {
    throw new Error('Unauthorized');
  }
  return res.json();
};

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: cart, error } = useSWR('/api/cart', fetcher);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!session && status === 'unauthenticated') {
      router.push('/api/auth/signin?callbackUrl=/cart');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (cart?.items) {
      const newTotal = cart.items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);
      setTotal(newTotal);
    }
  }, [cart]);

  const handleRemoveItem = async (productId) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        mutate('/api/cart');
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      if (res.ok) {
        mutate('/api/cart');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  if (status === 'loading') {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow divide-y">
                {cart.items.map((item) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow p-6 h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg">Total</span>
                <span data-testid="cart-total" className="font-bold text-2xl text-blue-600">
                  ${(total * 1.1).toFixed(2)}
                </span>
              </div>
              <button
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={cart.items.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
