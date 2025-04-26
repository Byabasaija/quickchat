import google.generativeai as genai
from app.schemas.chat import Question
from app.core.config import settings

api_key = settings.LLM_API_KEY

class ChatService:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(settings.MODEL_NAME)

    def _improve_prompt(self, question: Question) -> str:
        """Formats prompt for rewriting casual sentences professionally."""
        user_query = question.query.strip()
        prompt = (
            "You are a professional writing assistant specializing in transforming casual language into formal, professional text."

            "Your task is to rewrite the following casual text into a professional version while:"
            "- Maintaining the original meaning and key information"
            "- Eliminating slang, colloquialisms, and informal expressions"
            "- Using appropriate business/professional vocabulary"
            "- Improving sentence structure and grammar"
            "- Ensuring proper punctuation and formatting"

            f"Casual text to rewrite:\n"
            f"{user_query}\n\n"

            "Respond with only the rewritten professional text, without explanations or metadata."
        )
        return prompt

    async def ask_llm(self, question: Question) -> str | None:
        try:
            improved_prompt = self._improve_prompt(question)
            response = self.model.generate_content(improved_prompt)
            return response.text
        except Exception as e:
            print(f"Error communicating with LLM: {e}")
            return None

# Function to create an instance of the service with the API key
def get_chat_service(api_key: str = api_key):
    return ChatService(api_key=api_key)