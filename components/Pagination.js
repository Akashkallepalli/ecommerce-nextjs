import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Pagination({ currentPage, totalPages, hasNextPage }) {
  const router = useRouter();
  const query = router.query.q ? `?q=${router.query.q}&` : '?';

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link href={`${query}page=${currentPage - 1}`}>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            data-testid="pagination-prev"
          >
            Previous
          </button>
        </Link>
      )}

      <span
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        data-testid="pagination-info"
      >
        Page {currentPage} of {totalPages}
      </span>

      {hasNextPage && (
        <Link href={`${query}page=${currentPage + 1}`}>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            data-testid="pagination-next"
          >
            Next
          </button>
        </Link>
      )}
    </div>
  );
}
