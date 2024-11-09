import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = ({ showBackButton = false, onBackClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = (e) => {
    e.preventDefault();
    
    if (onBackClick) {
      onBackClick();
      return;
    }

    const lastSearchResults = sessionStorage.getItem('lastSearchResults');
    if (lastSearchResults) {
      navigate('/results', {
        state: { papers: JSON.parse(lastSearchResults) }
      });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="relative flex justify-center items-center">
      {showBackButton && (
        <Link 
          to="#" 
          onClick={handleBack}
          className="absolute left-0 text-indigo-600 hover:text-indigo-800 flex items-center"
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
        </Link>
      )}
      <Link to="/" className="text-4xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
        easypaper
      </Link>
    </div>
  );
};

export default Header;