import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-blue-400 hover:text-blue-300">
            Steam User Search
          </Link>
          <div className="flex gap-4">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Search
            </Link>
            <Link 
              to="/compare" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Compare Users
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;