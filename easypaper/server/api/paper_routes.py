import re, os
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import aiofiles
import httpx
from datetime import datetime
from pydantic import BaseModel
import tempfile
import pathlib
import PyPDF2

from services.papers import fetch_papers

router = APIRouter()

CURRENT_DIR = pathlib.Path(__file__).parent.parent
PAPERS_DIR = CURRENT_DIR.parent / 'server' / 'arxiv_papers'
PAPERS_DIR.mkdir(exist_ok=True)

class PaperRequest(BaseModel):
    pdf_url: str

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
    
@router.post("/summarize/")
async def summarize_paper(paper_request: PaperRequest):
    try:
        pdf_url = paper_request.pdf_url
        
        arxiv_id = pdf_url.split('/')[-1].replace('.pdf', '')
        pdf_path = PAPERS_DIR / f"{arxiv_id}.pdf"
        
        if not pdf_path.exists():
            async with httpx.AsyncClient() as client:
                response = await client.get(pdf_url, follow_redirects=True)
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=404,
                        detail="Could not download the paper"
                    )
                
                async with aiofiles.open(pdf_path, 'wb') as f:
                    await f.write(response.content)
        
        text_content = ""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                text_content = "\n".join(
                    page.extract_text() 
                    for page in pdf_reader.pages
                )

                text_content = re.sub(r'\n+', '\n', text_content)
                text_content = re.sub(r'\s+', ' ', text_content)
                text_content = text_content.strip()
                
        except Exception as e:
            text_content = f"Error extracting text: {str(e)}"

        mock_summary = {
            "summary": f"LLM Summarization",
            "file_size": pdf_path.stat().st_size,
            "download_time": datetime.now().isoformat(),
            "path": str(pdf_path),
            "full_text": text_content
        }
        
        return mock_summary

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing paper: {str(e)}"
        )