import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // This will only be called if auth is successful
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/api/auth/signin',
    },
  }
);

export const config = {
  matcher: ['/cart'],
};
