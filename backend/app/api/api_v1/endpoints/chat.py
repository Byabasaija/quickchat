from fastapi import APIRouter, HTTPException, Depends,Request
from app.schemas import Question, Answer
from app.services import ChatService, get_chat_service
from typing import Annotated


router = APIRouter()

@router.post("/ask/", response_model=Answer)
async def ask_question(
    question: Question,
    chat_service: Annotated[ChatService, Depends(get_chat_service)]
):
    llm_response = await chat_service.ask_llm(question)
    if llm_response:
        return {"response": llm_response}
    else:
        raise HTTPException(status_code=500, detail="Failed to get a response from the LLM.")
    