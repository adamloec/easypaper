import { Link } from 'react-router-dom';

const BackButton = () => (
  <Link 
    to="/" 
    className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 mb-8"
  >
    <svg 
      className="w-5 h-5" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span>Back to Search</span>
  </Link>
);

export default BackButton;