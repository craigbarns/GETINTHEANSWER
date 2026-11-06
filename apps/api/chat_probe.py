"""Free instant AI-visibility chat probe.

One question, one engine, no signup: the visitor pastes their business,
gets the live answer an AI engine gives today, and sees whether their
brand is cited. Funnel: probe -> free full audit -> paid plans.

The OpenAI-compatible client and model are injected by main.py, so this
module stays importable without a circular dependency.
"""

from pydantic import BaseModel


class ChatProbeRequest(BaseModel):
    company_name: str
    city: str
    industry: str
    services: str | None = None
    locale: str = "en"


class ChatProbeResponse(BaseModel):
    question: str
    engine: str
    answer_excerpt: str
    brand_mentioned: bool


def probe_question(request: ChatProbeRequest) -> str:
    city = request.city.strip().title()
    industry = request.industry.strip()
    if request.locale.strip().lower() == "fr":
        return f"Quel professionnel de {industry.lower()} recommanderiez-vous à {city} ?"
    return f"Who is the best {industry.lower()} in {city}?"


def brand_in_answer(answer: str, company_name: str) -> bool:
    """Case-insensitive whole-phrase match of the company name."""
    name = " ".join((company_name or "").lower().split())
    if not name:
        return False
    answer = " ".join((answer or "").lower().split())
    import re

    return re.search(rf"\b{re.escape(name)}\b", answer) is not None


async def run_chat_probe(client, model: str, request: ChatProbeRequest) -> ChatProbeResponse | None:
    import main  # local import: ask_engine lives in main.py

    question = probe_question(request)
    answer = await main.ask_engine(client, question, model=model)
    if not answer:
        return None
    return ChatProbeResponse(
        question=question,
        engine="ChatGPT",
        answer_excerpt=answer[:800],
        brand_mentioned=brand_in_answer(answer, request.company_name),
    )
