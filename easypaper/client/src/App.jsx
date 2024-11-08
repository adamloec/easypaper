import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import Header from './components/Header';
import Footer from './components/Footer';
import { searchPapers } from './services/api';

const App = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchPapers(searchParams);
      
      if (response.data) {
        if (response.data.length === 0) {
          setError('No papers found matching your search criteria. Try broadening your search.');
        } else {
          navigate('/results', { state: { papers: response.data } });
        }
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Search error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please verify the server is running on port 8000.');
      } else if (err.response?.status === 500) {
        setError('An unexpected error occurred. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl flex flex-col items-center space-y-12 -mt-16">
          <Header />
          
          <div className="w-full max-w-2xl">
            <SearchForm onSearch={handleSearch} loading={loading} />

            {error && (
              <div className="mt-4 text-red-500 bg-red-50 px-4 py-2 rounded-full text-center">
                {error}
              </div>
            )}

            {loading && (
              <div className="mt-4 text-gray-600 text-center">
                Searching papers...
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;