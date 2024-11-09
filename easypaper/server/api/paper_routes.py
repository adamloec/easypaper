import re, os
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import aiofiles
import httpx
from datetime import datetime
from urllib.parse import unquote

from services.papers import fetch_papers

router = APIRouter()

@router.get("/search/")
async def search(
    keyword: Optional[str] = Query(None, description="Keyword to search within papers"),
    category: Optional[str] = Query(None, description="Category code for arXiv search (e.g., cs.LG)"),
    max_results: int = Query(100, description="Maximum number of results to return", ge=1, le=1000)
):
    try:
        if not keyword and not category:
            raise HTTPException(status_code=400, detail="Please provide a keyword or category for search")

        def prepare_search_query(query: str) -> str:
            cleaned = re.sub(r'[^\w\s]', ' ', query)
            cleaned = ' '.join(cleaned.split())
            
            if ' ' in cleaned:
                terms = cleaned.split()
                return f"ti:({' OR '.join(terms)}) OR abs:({' OR '.join(terms)})"
            
            return f"ti:{cleaned} OR abs:{cleaned}"
        
        processed_keyword = prepare_search_query(keyword) if keyword else None

        search_category = category if category and category.strip() else None
        
        results = fetch_papers(
            keyword=processed_keyword,
            category=search_category,
            max_results=max_results
        )

        if not results:
            raise HTTPException(
                status_code=404, 
                detail="No papers found matching your search criteria. Try broadening your search."
            )
        
        if keyword:
            search_terms = set(keyword.lower().split())
            sorted_results = sorted(
                results,
                key=lambda paper: (
                    sum(term in paper.title.lower() for term in search_terms) * 2 +
                    sum(term in paper.summary.lower() for term in search_terms)
                ),
                reverse=True
            )
        else:
            sorted_results = results
        
        return [
            {
                "title": paper.title,
                "authors": [author.name for author in paper.authors],
                "published": paper.published,
                "summary": paper.summary,
                "pdf_url": paper.pdf_url
            }
            for paper in sorted_results
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error searching papers: {str(e)}"
        )