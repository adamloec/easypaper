const Paginator = ({ currentPage, totalPages, onPageChange }) => {
    const showPage = (pageNum) => {
      if (pageNum === 1 || pageNum === totalPages) return true;
      if (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) return true;
      return false;
    };
  
    const renderPageButton = (pageNum) => (
      <button
        key={pageNum}
        onClick={() => onPageChange(pageNum)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${currentPage === pageNum 
            ? 'bg-indigo-600 text-white' 
            : 'text-gray-700 hover:bg-indigo-50'}`}
      >
        {pageNum}
      </button>
    );
  
    const renderDots = (key) => (
      <span key={key} className="px-3 py-2 text-gray-500">
        ...
      </span>
    );
  
    return (
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 disabled:opacity-50 disabled:hover:bg-transparent"
        >
          Previous
        </button>
  
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          if (showPage(pageNum)) {
            return renderPageButton(pageNum);
          } else if (
            (pageNum === currentPage - 2 && pageNum > 2) ||
            (pageNum === currentPage + 2 && pageNum < totalPages - 1)
          ) {
            return renderDots(`dots${pageNum}`);
          }
          return null;
        })}
  
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 disabled:opacity-50 disabled:hover:bg-transparent"
        >
          Next
        </button>
      </div>
    );
  };
  
  export default Paginator;