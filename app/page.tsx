import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'E-Commerce Store | Welcome',
  description: 'Welcome to our premium e-commerce store',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-400">E-Commerce</div>
          <div className="space-x-4">
            <Link href="/products" className="text-gray-300 hover:text-blue-400 transition">
              Products
            </Link>
            <Link href="/cart" className="text-gray-300 hover:text-blue-400 transition">
              Cart
            </Link>
            <Link href="/api/auth/signin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to Our E-Commerce Store
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Discover amazing products at unbeatable prices
        </p>
        <div className="space-x-4">
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Shopping
          </Link>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-block border-2 border-blue-400 text-blue-400 px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 hover:text-slate-900 transition"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-700 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-600 p-6 rounded-lg">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast Shipping</h3>
              <p className="text-gray-300">Get your orders delivered quickly</p>
            </div>
            <div className="bg-slate-600 p-6 rounded-lg">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure Payment</h3>
              <p className="text-gray-300">Industry-leading security</p>
            </div>
            <div className="bg-slate-600 p-6 rounded-lg">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-white mb-2">Great Prices</h3>
              <p className="text-gray-300">Competitive pricing & regular discounts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2026 E-Commerce Store. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}