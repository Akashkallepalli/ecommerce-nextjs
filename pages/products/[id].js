import Header from '@/components/Header';
import prisma from '@/lib/prisma';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductDetail({ product }) {
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!session) {
      alert('Please sign in first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: parseInt(quantity),
        }),
      });

      if (response.ok) {
        alert('Added to cart!');
        setQuantity(1);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/">
          <span className="text-blue-600 hover:text-blue-700 cursor-pointer mb-4 inline-block">
            ← Back to Products
          </span>
        </Link>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
                data-testid="product-detail-image"
              />
            </div>

            {/* Details */}
            <div>
              <h1
                className="text-3xl font-bold text-gray-900 mb-2"
                data-testid="product-detail-name"
              >
                {product.name}
              </h1>

              <p className="text-gray-600 mb-4">{product.category}</p>

              <p className="text-2xl font-bold text-blue-600 mb-4">
                ${product.price}
              </p>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <p className="text-sm text-gray-500 mb-6">
                Stock: {product.stock} available
              </p>

              <div className="flex gap-4">
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                  data-testid="product-quantity"
                />

                <button
                  onClick={handleAddToCart}
                  disabled={loading || !session}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  data-testid="product-add-to-cart"
                >
                  {loading ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>

              {!session && (
                <p className="text-red-600 mt-4">
                  Please sign in to add items to cart
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const product = await prisma.product.findUnique({
    where: { id: context.params.id },
  });

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
    revalidate: 60,
  };
}
