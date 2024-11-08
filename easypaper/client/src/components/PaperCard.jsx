import { Link } from 'react-router-dom';

const PaperCard = ({ paper }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
    <Link to={`/paper/${encodeURIComponent(paper.pdf_url)}`} className="block h-full p-6">
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
      </div>
    </Link>
  </div>
);

export default PaperCard;