from langchain.callbacks import StreamingStdOutCallbackHandler
from langchain_core.callbacks import CallbackManager
from langchain_core.prompts import PromptTemplate
from typing import Optional, Dict, Any, List
from langchain.schema import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
import pypdf
from langchain.vectorstores import Chroma

import llama_cpp


text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )

def load_pdf(pdf_path: str, text_splitter) -> List[Document]:

        with open(pdf_path, 'rb') as file:
            pdf_reader = pypdf.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
        
        texts = text_splitter.split_text(text)
        return [Document(page_content=t) for t in texts]

all_text = load_pdf("test.pdf", text_splitter)

llm = llama_cpp.Llama(
    model_path="models/summary/Llama-3.1-8B-Instruct.gguf",
    embedding="True",
)

vector_store = Chroma.from_documents(
     documents=
)

documents = text_splitter.create_documents([text])
test = llm.create_embedding([item.page_content for item in documents])

template = """<|start_header_id|>system<|end_header_id|>
Cutting Knowledge Date: December 2023
Today Date: 12 Nov 2024

You are a professional at reading and summarizing research papers. Your job is to summarize text, and explain it simply and concisely.
Summarize the below text:
{text}
<|eot_id|><|start_header_id|>assistant<|end_header_id|>
"""

llm = llama_cpp.Llama(
    model_path="models/summary/Llama-3.1-8B-Instruct.gguf",
)

response = llm(
    template,
    max_tokens=2048,
    echo=True
)
print(response["choices"][0]["text"])