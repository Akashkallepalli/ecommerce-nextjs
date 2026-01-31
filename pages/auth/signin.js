import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { callbackUrl = '/' } = router.query;

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl || '/');
    }
  }, [status, router, callbackUrl]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>

        <button
          data-testid="signin-button"
          onClick={() => signIn('github', { callbackUrl })}
          className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.186.092-.923.35-1.544.636-1.9-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.578.688.48C17.138 18.194 20 14.44 20 10.017 20 4.484 15.522 0 10 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          Sign in with GitHub
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => signIn('github')}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Create one
            </button>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-center block">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
