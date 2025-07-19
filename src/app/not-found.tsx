import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white">404</h1>
          <div className="h-2 w-24 bg-gray-700/40 mx-auto mt-2 rounded-full"></div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        
        <p className="text-gray-300 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 border border-gray-700/50"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}