import Header from '@/components/Header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Cart() {
  const { data: session } = useSession();
  const router = useRouter();
  const [updating, setUpdating] = useState(null);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600 py-12">
            Please sign in to view your cart
          </p>
        </main>
      </div>
    );
  }

  const { data: cartData, mutate } = useSWR(
    session ? '/api/cart' : null,
    fetcher,
    { revalidateOnFocus: true }
  );

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(id);
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        mutate();
      }
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (id) => {
    setUpdating(id);
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        mutate();
      }
    } finally {
      setUpdating(null);
    }
  };

  if (!cartData) return <div className="text-center py-12">Loading...</div>;

  const items = cartData.items || [];
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              data-testid="continue-shopping"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left">Product</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">Quantity</th>
                    <th className="px-6 py-3 text-left">Total</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span>{item.product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        ${item.product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value))
                          }
                          disabled={updating === item.id}
                          className="w-16 px-2 py-1 border border-gray-300 rounded"
                          data-testid={`quantity-${item.id}`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={updating === item.id}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                          data-testid={`remove-${item.id}`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex justify-end mb-6">
                <div className="w-64">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4 pb-4 border-b">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  data-testid="continue-shopping-btn"
                >
                  Continue Shopping
                </button>
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  data-testid="checkout-btn"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
