import os
from typing import Dict, List, Optional, Any
from langchain_community.llms import LlamaCpp
from langchain_community.embeddings import LlamaCppEmbeddings

from .base import BaseSummarizer, SummarizerConfig

class LlamaSummarizer(BaseSummarizer):

    @classmethod
    def from_model_path(cls, model_path: str, n_ctx: int = 2048, n_batch: int = 512, config: Optional[SummarizerConfig] = None):

        llm = LlamaCpp(
            model_path="" or model_path,
            n_ctx=n_ctx,
            n_batch=n_batch,
            verbose=False
        )
        
        embeddings = LlamaCppEmbeddings(
            model_path="" or model_path,
            n_ctx=n_ctx,
            n_batch=n_batch
        )
        
        return cls(llm=llm, embeddings=embeddings, config=config)