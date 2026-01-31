import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            EStore
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>

            <Link href="/cart" className="text-gray-700 hover:text-gray-900">
              Cart
            </Link>

            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">Hi, {session.user?.name || session.user?.email}</span>
                <button
                  data-testid="signout-button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                data-testid="signin-button"
                href="/api/auth/signin"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
