import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  const errorMessages = {
    OAuthSignin: 'Error connecting to the authentication provider.',
    OAuthCallback: 'Error handling the authentication provider callback.',
    OAuthCreateAccount: 'Error creating account with the authentication provider.',
    EmailCreateAccount: 'Error creating account with email.',
    Callback: 'Error in the authentication callback.',
    OAuthAccountNotLinked: 'This account is not linked to the authentication provider.',
    default: 'An error occurred during sign in.',
  };

  const message = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-red-600 text-5xl mb-4 text-center">!</div>
        <h1 className="text-2xl font-bold text-center mb-4">Authentication Error</h1>
        <p className="text-gray-600 text-center mb-6">{message}</p>

        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block text-center bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
