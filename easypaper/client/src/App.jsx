import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const App = () => {
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', search);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen -mt-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-8 text-center">
            easypaper
          </h1>
          
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-4 px-6 pr-12 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg"
                placeholder="Search Arxiv..."
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:text-gray-700"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
