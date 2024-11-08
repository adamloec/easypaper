from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from services.papers import Papers

router = APIRouter()
papers = Papers()

@router.get("/search/")
async def search(
    keyword: Optional[str] = Query(None, description="Keyword to search within papers"),
    category: Optional[str] = Query(None, description="Category code for arXiv search (e.g., cs.LG)"),
    max_results: int = 10
):
    try:
        results = papers.fetch_papers(keyword=keyword, category=category, max_results=max_results)

        if not results:
            raise HTTPException(status_code=404, detail="No Arxiv papers found.")
        
        return [
            {
                "title": paper.title,
                "authors": [author.name for author in paper.authors],
                "published": paper.published,
                "summary": paper.summary,
                "pdf_url": paper.pdf_url
            }
            for paper in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))