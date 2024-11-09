import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getPaperSummary } from '../services/api';

const PaperCard = ({ paper, searchResults }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handlePaperClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPaperSummary(paper.pdf_url);
      
      navigate(`/paper/${encodeURIComponent(paper.pdf_url)}`, {
        state: {
          paperDetails: {
            ...paper,
            fullText: response.full_text,
            aiSummary: response.summary,
            downloadTime: response.download_time,
            fileSize: response.file_size
          },
          previousSearchResults: searchResults
        }
      });
    } catch (error) {
      console.error('Error fetching paper:', error);
      setError(
        error.response?.data?.detail || 
        'Failed to load paper details. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
      <Link 
        to={`/paper/${encodeURIComponent(paper.pdf_url)}`} 
        className="block h-full p-6"
        onClick={handlePaperClick}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors">
            {paper.title}
          </h2>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600 line-clamp-2">
              {paper.authors.join(', ')}
            </p>
            
            <p className="text-sm text-gray-500">
              Published: {new Date(paper.published).toLocaleDateString()}
            </p>
          </div>
          
          <p className="text-gray-700 line-clamp-3">
            {paper.summary}
          </p>

          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
              <span className="ml-2 text-sm text-gray-600">Loading paper...</span>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PaperCard;