import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import { CS_CATEGORIES } from '../constants';

const SearchForm = ({ onSearch, loading }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search: search.trim(), category });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-4 px-6 pr-12 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg"
          placeholder="Search Arxiv..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="relative mt-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full py-3 px-6 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg appearance-none bg-white cursor-pointer disabled:opacity-50"
          disabled={loading}
        >
          {CS_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
    </form>
  );
};

export default SearchForm;