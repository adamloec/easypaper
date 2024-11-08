import { useLocation } from 'react-router-dom';
import { useState, useMemo } from 'react';

import ResultsGrid from './components/ResultsGrid';
import Header from './components/Header';
import Paginator from './components/Paginator';
import Footer from './components/Footer';

const ITEMS_PER_PAGE = 9;

const Results = () => {
  const location = useLocation();
  const allPapers = location.state?.papers || [];
  const [currentPage, setCurrentPage] = useState(1);

  const { paginatedPapers, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    return {
      paginatedPapers: allPapers.slice(startIndex, endIndex),
      totalPages: Math.ceil(allPapers.length / ITEMS_PER_PAGE)
    };
  }, [allPapers, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50">
      <div className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header showBackButton={true} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {allPapers.length > 0 ? (
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

            <ResultsGrid papers={paginatedPapers} />
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

export default Results;