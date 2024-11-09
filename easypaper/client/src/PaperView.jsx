import { useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

const PaperDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paperDetails, previousSearchResults } = location.state || {};

  const handleBackNavigation = () => {
    if (previousSearchResults) {
      navigate('/results', { 
        state: { papers: previousSearchResults }
      });
    } else {
      const lastSearchResults = sessionStorage.getItem('lastSearchResults');
      if (lastSearchResults) {
        navigate('/results', { 
          state: { papers: JSON.parse(lastSearchResults) }
        });
      } else {
        navigate('/');
      }
    }
  };

  const {
    title,
    authors,
    published,
    summary,
    fullText,
    aiSummary,
    downloadTime,
    fileSize,
    pdf_url
  } = paperDetails || {};

  if (!paperDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50">
        <div className="w-full py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Header showBackButton={true} onBackClick={handleBackNavigation} />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Paper details not found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50">
      <div className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header showBackButton={true} onBackClick={handleBackNavigation} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600 mb-2">{authors.join(', ')}</p>
            <p className="text-sm text-gray-500">
              Published: {new Date(published).toLocaleDateString()}
            </p>
          </div>

          {/* AI Summary */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">AI Summary</h2>
            <p className="text-gray-700 whitespace-pre-line">{aiSummary}</p>
          </div>

          {/* Original Abstract */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Original Abstract</h2>
            <p className="text-gray-700">{summary}</p>
          </div>

          {/* Metadata */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <p>File Size: {(fileSize / 1024 / 1024).toFixed(2)} MB</p>
              <p>Processed: {new Date(downloadTime).toLocaleString()}</p>
              <a 
                href={pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
              >
                View Original PDF
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaperDetail;