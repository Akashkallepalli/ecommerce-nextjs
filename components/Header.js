import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <span className="text-2xl font-bold text-blue-600">ECart</span>
            </div>
          </Link>

          {/* Search and Cart */}
          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Search products..."
              defaultValue={router.query.q || ''}
              onChange={(e) => {
                const query = e.target.value;
                if (query.trim()) {
                  router.push(`/?q=${encodeURIComponent(query)}`);
                } else {
                  router.push('/');
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="search-input"
            />
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <div className="text-gray-700 hover:text-blue-600 cursor-pointer" data-testid="cart-link">
                🛒 Cart
              </div>
            </Link>

            {session ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  data-testid="signout-button"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('github')}
                className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                data-testid="signin-button"
              >
                Sign In with GitHub
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
