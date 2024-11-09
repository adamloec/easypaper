import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const CS_CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'cs.AI', label: 'Artificial Intelligence' },
  { value: 'cs.AR', label: 'Hardware Architecture' },
  { value: 'cs.CC', label: 'Computational Complexity' },
  { value: 'cs.CE', label: 'Computational Engineering, Finance, and Science' },
  { value: 'cs.CL', label: 'Computation and Language' },
  { value: 'cs.CG', label: 'Computational Geometry' },
  { value: 'cs.CR', label: 'Cryptography and Security' },
  { value: 'cs.CV', label: 'Computer Vision and Pattern Recognition' },
  { value: 'cs.CY', label: 'Computers and Society' },
  { value: 'cs.DB', label: 'Databases' },
  { value: 'cs.DC', label: 'Distributed, Parallel, and Cluster Computing' },
  { value: 'cs.DL', label: 'Digital Libraries' },
  { value: 'cs.DM', label: 'Discrete Mathematics' },
  { value: 'cs.DS', label: 'Data Structures and Algorithms' },
  { value: 'cs.ET', label: 'Emerging Technologies' },
  { value: 'cs.FL', label: 'Formal Languages and Automata Theory' },
  { value: 'cs.GL', label: 'General Literature' },
  { value: 'cs.GR', label: 'Graphics' },
  { value: 'cs.GT', label: 'Computer Science and Game Theory' },
  { value: 'cs.HC', label: 'Human-Computer Interaction' },
  { value: 'cs.IR', label: 'Information Retrieval' },
  { value: 'cs.IT', label: 'Information Theory' },
  { value: 'cs.LG', label: 'Machine Learning' },
  { value: 'cs.LO', label: 'Logic in Computer Science' },
  { value: 'cs.MA', label: 'Multiagent Systems' },
  { value: 'cs.MM', label: 'Multimedia' },
  { value: 'cs.MS', label: 'Mathematical Software' },
  { value: 'cs.NA', label: 'Numerical Analysis' },
  { value: 'cs.NE', label: 'Neural and Evolutionary Computing' },
  { value: 'cs.NI', label: 'Networking and Internet Architecture' },
  { value: 'cs.OH', label: 'Other Computer Science' },
  { value: 'cs.OS', label: 'Operating Systems' },
  { value: 'cs.PF', label: 'Performance' },
  { value: 'cs.PL', label: 'Programming Languages' },
  { value: 'cs.RO', label: 'Robotics' },
  { value: 'cs.SC', label: 'Symbolic Computation' },
  { value: 'cs.SD', label: 'Sound' },
  { value: 'cs.SE', label: 'Software Engineering' },
  { value: 'cs.SI', label: 'Social and Information Networks' },
  { value: 'cs.SY', label: 'Systems and Control' }
];

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