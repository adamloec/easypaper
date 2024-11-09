import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { getPapers } from './services/api';

import ResultsGrid from './components/ResultsGrid';
import Header from './components/Header';
import Paginator from './components/Paginator';
import Footer from './components/Footer';
import SearchFormCompact from './components/SearchFormCompact';

const ITEMS_PER_PAGE = 9;

const ResultsView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [papers, setPapers] = useState(location.state?.papers || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialSearch = location.state?.searchParams?.search || '';
  const initialCategory = location.state?.searchParams?.category || '';

  useMemo(() => {
    if (papers.length > 0) {
      sessionStorage.setItem('lastSearchResults', JSON.stringify(papers));
    }
  }, [papers]);

  const { paginatedPapers, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    return {
      paginatedPapers: papers.slice(startIndex, endIndex),
      totalPages: Math.ceil(papers.length / ITEMS_PER_PAGE)
    };
  }, [papers, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPapers(searchParams);
      if (response.data) {
        setPapers(response.data);
        setCurrentPage(1);
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Search error:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please verify the server is running on port 8000.');
      } else {
        setError('No papers found matching your search criteria. Try broadening your search.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <Header compact={true} showBackButton={false} />
            </div>
            <div className="flex-grow">
              <SearchFormCompact 
                initialSearch={initialSearch}
                initialCategory={initialCategory}
                onSearch={handleSearch}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : papers.length > 0 ? (
          <>
            {totalPages > 1 && (
              <div className="mb-8">
                <Paginator 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            <ResultsGrid 
              papers={paginatedPapers} 
              searchResults={papers}  
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No papers found. Try a different search.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ResultsView;