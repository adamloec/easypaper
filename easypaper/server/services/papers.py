import arxiv
from typing import Optional, List

class Papers:

    def fetch_papers(self, keyword: Optional[str], category: Optional[str] = None, max_results: int = None):

        if category and keyword:
            query = f"cat:{category} AND {keyword}"
        elif category:
            query = f"cat:{category}"
        elif keyword:
            query = keyword
        else:
            query = "cat:cs.AI"
        
        search = arxiv.Search(
            query=query,
            max_results=max_results,
            sort_by=arxiv.SortCriterion.SubmittedDate
        )

        return list(search.results())