import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import { CS_CATEGORIES } from '../constants';

const SearchFormCompact = ({ initialSearch = '', initialCategory = '', onSearch, loading }) => {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search: search.trim(), category });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-4xl">
      <div className="relative flex-grow">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-2 px-4 pr-10 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md"
          placeholder="Search Arxiv..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="relative w-64">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full py-2 px-4 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md appearance-none bg-white cursor-pointer disabled:opacity-50"
          disabled={loading}
        >
          {CS_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </form>
  );
};

export default SearchFormCompact;