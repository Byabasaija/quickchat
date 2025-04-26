# Professional Sentence Rewriter

A full-stack application that transforms casual sentences into professional, polished language using AI. Built with Next.js, FastAPI, and LLM integration.

![Professional Sentence Rewriter](/shot.png)

## 📋 Features

- **Instant Rewrites**: Transform casual text into professional language in seconds
- **Query History**: Access your past rewrites with localStorage persistence
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Clean UI**: Intuitive interface with clear input/output sections
- **Fast API Backend**: Efficient processing with FastAPI

## 🛠️ Tech Stack

### Frontend
- **Next.js** (latest version)
- **TailwindCSS** for styling
- **ShadCN** for components
- **React Hooks** for state management
- **LocalStorage** for query persistence

### Backend
- **FastAPI** for API development
- **Pydantic** for data validation
- **Python-dotenv** for environment management
- **LLM Integration** (Claude API)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.9+)
- API key for Gemini

### Installation

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Add your LLM API key to the `.env` file:
   ```
   LLM_API_KEY=your_api_key_here
   MODEL_NAME=claude-3-haiku-20240307
   ```

6. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

4. Update the API endpoint in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Coccurently
You can run the backend and frontend coccurently in the root directory by running the following
- Run nom install to install cocurrently
- Start the development servers with;
```bash
npm install
npm run dev
```

## 📝 API Documentation

Once the backend is running, access the Swagger UI documentation at:
```
http://localhost:8000/docs
```

### Key Endpoints

- `POST /api/v1/ask`: Accepts casual text and returns professionally rewritten content

## 💬 LLM Prompt Documentation

The application uses carefully crafted prompts to ensure high-quality rewrites. Below are the core prompts used in the system:

### Base Rewrite Prompt
```
You are a professional writing assistant specializing in transforming casual language into formal, professional text.

Your task is to rewrite the following casual text into a professional version while:
- Maintaining the original meaning and key information
- Eliminating slang, colloquialisms, and informal expressions
- Using appropriate business/professional vocabulary
- Improving sentence structure and grammar
- Ensuring proper punctuation and formatting

Casual text to rewrite:
{input_text}

Respond with only the rewritten professional text, without explanations or metadata.
```


## 🔒 Environment Variables

### Backend (.env)
```
LLM_API_KEY=your_api_key_here
MODEL_NAME=your_model_name_here
API_V1_STR=/api/v1
BACKEND_CORS_ORIGINS=http://localhost:3000
PROJECT_NAME=quickchat
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.