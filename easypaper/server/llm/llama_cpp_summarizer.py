import os, shutil
from typing import Optional, Dict, Any, List
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.schema import Document
import llama_cpp

import pypdf

class LlamaCppSummarizer:
    def __init__(self, model_path: str, embedding_model_path: Optional[str]):

        self.model_path = model_path
        self.embedding_model_path = embedding_model_path or self.model_path
        
        self.model = None
        self.embeddings = None
        self.vector_store = None
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        
    def load_model(self, model_kwargs: Optional[Dict[Any, Any]] = None) -> None:
        model_kwargs = model_kwargs or {
            # Potential for default arguments
        }
        
        self.model = llama_cpp.Llama(
            model_path=self.model_path,
            **model_kwargs
        )

    def load_embeddings(self, model_kwargs: Optional[Dict[Any, Any]] = None) -> None:
        model_kwargs = model_kwargs or {
            # Potential for default arguments
        }

        if self.embeddings is None:

            self.embeddings = llama_cpp.Llama(
                model_path=self.embedding_model_path,
                embedding="True",
                **model_kwargs
            )

    def unload(self) -> None:
        if self.model:
            del self.model
            self.model = None

        if self.vector_store:
            if hasattr(self.vector_store, "persist_directory") and self.vector_store.persist_directory:
                if os.path.exists(self.vector_store.persist_directory):
                    shutil.rmtree(self.vector_store.persist_directory)
            self.vector_store = None

        self.tokenizer = None
        self.embeddings = None
    
    def load_pdf(self, pdf_path: str) -> List[Document]:

        with open(pdf_path, 'rb') as file:
            pdf_reader = pypdf.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
        
        texts = self.text_splitter.split_text(text)
        return [Document(page_content=t) for t in texts]
    
    def create_vector_store(self, documents: List[Document]) -> None:
        if self.embeddings is None:
            self.load_embeddings()
            
        self.vector_store = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings
        )
    
    def generate_response(self, query: str, context: List[Document]) -> str:
        context_text = "\n".join(doc.page_content for doc in context)

        prompt = f"""<|start_header_id|>system<|end_header_id|>
        Cutting Knowledge Date: December 2023
        Today Date: 12 Nov 2024

        You are an AI assistant helping to summarize documents.
        Your task is to analyze the provided text sections and create a coherent summary 
        that captures the key information while maintaining context between sections.

        The following are semantically related sections of the document:
        {context_text}

        Based on these sections, please provide a comprehensive summary that:
        1. Preserves the key information and relationships between concepts
        2. Maintains logical flow and context
        3. Highlights the most important insights
        
        Summary:
        <|eot_id|><|start_header_id|>user<|end_header_id|>
        """

        response = self.model(
            prompt,
            max_tokens=2048,
            temperature=0.5,
            stop=["Based on these sections:"]
        )
    
        return response['choices'][0]['text']
    
    def summarize(self, query: str, top_k: int = 3) -> str:

        if not self.vector_store:
            raise ValueError("No vector store found. Please load documents first.")
            
        retrieved_docs = self.vector_store.similarity_search(query, k=top_k)
        return self.generate_response(query, retrieved_docs)
    
    def is_loaded(self) -> bool:
        return (self.model is not None and 
                self.tokenizer is not None and 
                self.embeddings is not None)