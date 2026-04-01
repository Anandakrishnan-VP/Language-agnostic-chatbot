<div align="center">
  <h1>🌍 Campus Assistant AI</h1>
  <h3>The Ultimate Language-Agnostic RAG Chatbot for Educational Institutions</h3>
</div>

<br />

## 🎯 The Problem
Campus offices handle thousands of repetitive student queries every single semester regarding fees, scholarships, academic calendars, and exam schedules. However, a massive **communication gap** exists when students (especially international or regional students) prefer communicating in their native languages rather than English. Existing university information is buried deeply in complex circulars and unsearchable PDFs.

## 🚀 The Solution
**Campus Assistant AI** is a multilingual, intelligent conversational chatbot that completely shatters language barriers. It dynamically reads your college's actual PDF documents and circulars, and instantly answers student queries with hyper-accurate facts in **any language** the student chooses to type in. 

If a student asks a query in Hindi, Marathi, Tamil, or English, the AI instantly digests the college's English PDFs and responds fluently in the student's requested language using a powerful Retrieval-Augmented Generation (RAG) architecture.

---

## ✨ Key Features
- **🗣️ True Language Agnosticism:** Speak to the bot in over 50+ regional languages. The AI natively translates, understands, and replies in the exact same language.
- **📚 Zero-Training Document Ingestion:** Just drag and drop your university's raw PDFs, FAQs, or TXT circulars into the `data` folder. The system instantly chunks, embeds, and memorizes them.
- **⚡ Blazing Fast Architecture:** Powered by the cutting-edge open-source **Llama 3.1** model via the Groq API for sub-second conversational responses.
- **💻 100% Free & Portable Embeddings:** Utilizes offline CPU-based `HuggingFace` embeddings, guaranteeing zero embedding API costs and maximum privacy for institutional documents.
- **🎨 Modern UX:** A sleek, fully responsive, glass-morphism React frontend built with Tailwind CSS.

---

## 🛠️ Technology Stack

**Frontend**
- React 18 & TypeScript
- Vite
- Tailwind CSS & shadcn/ui

**Backend API**
- Python 3.11 & FastAPI
- Langchain (RAG Framework)
- ChromaDB (Local Vector Database)

**Machine Learning**
- **LLM:** Meta Llama 3.1 8B (via Groq API)
- **Embeddings:** `all-MiniLM-L6-v2` (via HuggingFace local CPU)

---

## 💻 Getting Started (Local Setup)

Want to run the project locally? Follow these simple steps:

### 1. Clone the Repository
```bash
git clone https://github.com/Anandakrishnan-VP/Language-agnostic-chatbot.git
cd "Language-agnostic-chatbot"
```

### 2. Setup the AI Backend
Navigate into the backend and create your secure isolated environment.
```bash
cd backend
python -m venv venv

# Windows Activation:
.\venv\Scripts\activate
# Mac/Linux Activation:
# source venv/bin/activate

# Install the machine-learning pipeline
pip install -r requirements.txt
```

### 3. Configure API Keys
Create a file named `.env` inside the `backend/` folder and insert your free Groq API key:
```env
GROQ_API_KEY="gsk_YourGroqApiKeyHere"
```

### 4. Feed the AI (Optional)
Drop any sample University PDFs or Text files straight into the `backend/data/` directory!

### 5. Launch the Servers

**Terminal 1 (Backend):**
```bash
cd backend
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

Click the provided `localhost` link in Terminal 2, and start chatting with your new Campus Assistant!
