export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to E-Commerce</h1>
        <p className="text-gray-600 mb-8">Your online shopping destination</p>
        <a href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Start Shopping
        </a>
      </div>
    </div>
  );
}