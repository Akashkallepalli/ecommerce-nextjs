import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import prisma from '@/lib/prisma';
import { useRouter } from 'next/router';

const ITEMS_PER_PAGE = 12;

export default function Home({ products, totalCount, currentPage }) {
  const router = useRouter();
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Products Catalog
        </h1>

        {router.query.q && (
          <p className="text-gray-600 mb-6">
            Search results for: <strong>{router.query.q}</strong>
          </p>
        )}

        {products.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No products found
          </p>
        ) : (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-testid="products-grid"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={currentPage < totalPages}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const page = parseInt(context.query.page || '1');
  const searchQuery = context.query.q || '';

  const skip = (page - 1) * ITEMS_PER_PAGE;

  const where = searchQuery
    ? {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      }
    : {};

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: ITEMS_PER_PAGE,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      totalCount,
      currentPage: page,
    },
    revalidate: 60,
  };
}
