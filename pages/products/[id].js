import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { prisma } from '@/lib/prisma';
import AddToCartButton from '@/components/AddToCartButton';

export default function ProductDetailPage({ product }) {
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Products
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="flex items-center justify-center bg-white rounded-lg p-8">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <h1 data-testid="product-name" className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="mb-6">
              <p data-testid="product-price" className="text-3xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-gray-600 mt-2">
                In Stock: <span className="font-semibold">{product.stock} units</span>
              </p>
            </div>

            <p data-testid="product-description" className="text-gray-700 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <AddToCartButton
                productId={product.id}
                quantity={quantity}
                disabled={product.stock === 0 || !session}
              />
            </div>

            {!session && (
              <p className="text-amber-600 text-sm">
                Please sign in to add items to your cart.
              </p>
            )}

            {product.stock === 0 && (
              <p className="text-red-600 text-sm">Out of stock</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        product: JSON.parse(JSON.stringify(product)),
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      notFound: true,
    };
  }
}
