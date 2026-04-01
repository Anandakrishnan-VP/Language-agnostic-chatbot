import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFDirectoryLoader, TextLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CHROMA_DB_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

# Initialize models
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
llm = ChatGroq(model_name="llama-3.1-8b-instant", temperature=0.3)

def load_and_process_documents():
    """Load PDFs and text files from the data directory and ingest into vector db."""
    # Load PDFs
    pdf_loader = PyPDFDirectoryLoader(DATA_DIR)
    pdf_docs = pdf_loader.load()
    
    # Load text files
    txt_loader = DirectoryLoader(DATA_DIR, glob="**/*.txt", loader_cls=TextLoader)
    txt_docs = txt_loader.load()
    
    docs = pdf_docs + txt_docs
    
    if not docs:
        print("No documents found in the data directory.")
        return None
        
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)
    
    # Create and persist vector db
    vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings, persist_directory=CHROMA_DB_DIR)
    vectorstore.persist()
    print(f"Ingested {len(splits)} chunks into the database.")
    return vectorstore

def get_retriever():
    """Retrieve or create the vector database"""
    if os.path.exists(CHROMA_DB_DIR) and len(os.listdir(CHROMA_DB_DIR)) > 0:
        vectorstore = Chroma(persist_directory=CHROMA_DB_DIR, embedding_function=embeddings)
    else:
        # DB doesn't exist, create it from docs
        if not os.path.exists(DATA_DIR):
            os.makedirs(DATA_DIR, exist_ok=True)
        vectorstore = load_and_process_documents()
        
    if vectorstore is None:
        return None
        
    return vectorstore.as_retriever(search_kwargs={"k": 4})

# Setup the RAG Chain
retriever = get_retriever()

system_prompt = (
    "You are a helpful and polite virtual assistant for the university/college campus. "
    "You answer student queries related to fees, scholarships, policies, and schedules. "
    "Respond to the student in the EXACT SAME LANGUAGE they used to ask the question. "
    "For instance, if they ask in Hindi, reply in Hindi. If in English, reply in English. "
    "If in Marathi, reply in Marathi, and so on. "
    "Use the following pieces of retrieved context to answer the question. "
    "If you don't know the answer or the context doesn't have the information, state that clearly "
    "and advise the student to contact the administrative office for human support. "
    "Keep answers clear, concise, and structured.\n\n"
    "Context: {context}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

# Initialize the RAG chain globally if retriever is available
rag_chain = None
if retriever:
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)

def get_answer(query: str) -> str:
    """Takes a query and returns the answer using RAG."""
    global rag_chain, retriever
    
    # Try re-initializing if docs were added late
    if rag_chain is None:
        retriever = get_retriever()
        if retriever is None:
            # Fallback when no docs are uploaded yet
            # Direct LLM call instead, letting it know it's missing docs
            response = llm.invoke([
                ("system", system_prompt.replace("{context}", "No institutional documents have been uploaded yet.")),
                ("human", query)
            ])
            return response.content
            
        question_answer_chain = create_stuff_documents_chain(llm, prompt)
        rag_chain = create_retrieval_chain(retriever, question_answer_chain)

    if rag_chain:
        response = rag_chain.invoke({"input": query})
        return response["answer"]
        
    return "The system is currently unavailable. Please contact the administrative office."
