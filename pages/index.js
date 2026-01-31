import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';

export default function HomePage({ products, totalPages, currentPage, searchQuery }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (query) => {
    setIsLoading(true);
    router.push(`/?q=${encodeURIComponent(query)}&page=1`);
  };

  const handlePageChange = (page) => {
    setIsLoading(true);
    const queryString = searchQuery ? `?q=${encodeURIComponent(searchQuery)}&page=${page}` : `?page=${page}`;
    router.push(queryString);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-gray-600">Browse our collection of premium products</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No products found matching your search.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              data-testid="pagination-prev"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              Previous
            </button>

            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              data-testid="pagination-next"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { q = '', page = '1' } = context.query;
  const productsPerPage = 12;
  const pageNumber = parseInt(page, 10);

  try {
    // Build where clause for search
    const whereClause = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {};

    // Get total count
    const totalCount = await prisma.product.count({
      where: whereClause,
    });

    // Get paginated products
    const products = await prisma.product.findMany({
      where: whereClause,
      skip: (pageNumber - 1) * productsPerPage,
      take: productsPerPage,
      orderBy: { createdAt: 'desc' },
    });

    const totalPages = Math.ceil(totalCount / productsPerPage);

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        totalPages,
        currentPage: pageNumber,
        searchQuery: q,
      },
      revalidate: 10, // ISR: revalidate every 10 seconds
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      notFound: true,
    };
  }
}
