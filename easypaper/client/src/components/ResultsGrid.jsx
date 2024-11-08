import PaperCard from './PaperCard';

const ResultsGrid = ({ papers }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {papers.map((paper, index) => (
      <PaperCard key={index} paper={paper} />
    ))}
  </div>
);

export default ResultsGrid;