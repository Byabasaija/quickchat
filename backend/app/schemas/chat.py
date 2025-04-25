from pydantic import BaseModel, Field

class Question(BaseModel):
    query: str = Field(..., description="The user's question.")

class Answer(BaseModel):
    response: str = Field(..., description="The LLM's answer to the question.")