from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from pathlib import Path
from langchain_core.language_models.base import BaseLanguageModel
from langchain_core.embeddings import Embeddings
from langchain_core.prompts import PromptTemplate
from langchain_core.documents import Document
from langchain.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter

@dataclass
class SummarizerConfig:
    chunk_size: int = 1000
    chunk_overlap: int = 200
    collection_name: str = "summarizer_collection"
    persist_directory: Optional[str] = None

class BaseSummarizer:

    def __init__(self, llm: BaseLanguageModel, embeddings: Embeddings, config: Optional[SummarizerConfig] = None):
        self.llm = llm
        self.embeddings = embeddings
        self.config = config or SummarizerConfig()
        
        self.vector_store = None
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=self.config.chunk_size, chunk_overlap=self.config.chunk_overlap, length_function=len)
        self.summary_prompt = PromptTemplate(input_variables=["text", "context"], template="""Please summarize the following text concisely: Text: {text} {context} Summary:""")
        self.combine_prompt = PromptTemplate(input_variables=["summaries"], template="""Please combine these summaries into a coherent summary: {summaries} Combined summary:""")

    def initialize(self) -> None:
        if self.config.persist_directory:
            path = Path(self.config.persist_directory)
            path.mkdir(parents=True, exist_ok=True)
        
        self.vector_store = Chroma(collection_name=self.config.collection_name, embedding_function=self.embeddings, persist_directory=self.config.persist_directory)

    def add_to_knowledge_base(self, text: str, metadata: Optional[Dict] = None) -> None:
        if self.vector_store is None:
            return
        
        texts = self.text_splitter.split_text(text)
        documents = [Document(page_content=chunk, metadata=metadata or {}) for chunk in texts]

        self.vector_store.add_documents(documents)

        if self.config.persist_directory:
            self.vector_store.persist()
    
    def get_relevant_context(self, query: str, n_results: int = 3) -> List[Document]:
        return self.vector_store.similarity_search(query, k=n_results)
    
    def summarize(self, text: str, query: Optional[str] = None) -> str:
        context = ""
        if query:
            relevant_docs = self.get_relevant_context(query)
            context = "Consider this relevant context:\n" + "\n\n".join(doc.page_content for doc in relevant_docs)
        
        chunks = self.text_splitter.split_text(text)
        summaries = []

        for chunk in chunks:
            summary = self.llm.predict(self.summary_prompt.format(text=chunk, context=context))
            summaries.append(summary)
        
        if len(summaries) == 1:
            return summaries[0]

        combined_summary = self.llm.predict(self.combine_prompt.format(summaries="\n\n".join(summaries)))
        return combined_summary
    
    def clear_knowledge_base(self) -> None:
        self.vector_store.delete_collection()
        self.vector_store = Chroma(collection_name=self.config.collection_name, embedding_function=self.embeddings, persist_directory=self.config.persist_directory)