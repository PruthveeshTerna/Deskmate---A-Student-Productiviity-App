"""
LLM Fallback Chain Utility
===========================
Tries providers in order: Groq (Llama 3.3) → Gemini 2.5 Flash → OpenRouter.
Each provider is retried up to 3 times before falling back to the next.
Returns the raw text response or None if all providers fail.
"""

import os
import time
import logging

from groq import Groq
from google import genai
from openai import OpenAI

logger = logging.getLogger(__name__)

MAX_RETRIES = 3
RETRY_DELAY = 0.5  # seconds between retries


def _call_groq(prompt: str) -> str | None:
    """Call Groq with Llama 3.1 8B Instant."""
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        logger.warning("GROQ_API_KEY not set — skipping Groq")
        return None

    client = Groq(api_key=api_key)

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4,
                max_tokens=8192,
            )
            return response.choices[0].message.content
        except Exception as e:
            err_str = str(e)
            logger.warning("Groq attempt %d/%d failed: %s", attempt, MAX_RETRIES, e)
            # Don't retry on rate limit — immediately fall through to next provider
            if "rate_limit" in err_str or "429" in err_str:
                logger.warning("Groq rate limited — skipping remaining retries")
                return None
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
    return None


def _call_gemini(prompt: str) -> str | None:
    """Call Google Gemini 2.5 Flash."""
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        logger.warning("GEMINI_API_KEY not set — skipping Gemini")
        return None

    client = genai.Client(api_key=api_key)

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
            )
            return response.text
        except Exception as e:
            err_str = str(e)
            logger.warning("Gemini attempt %d/%d failed: %s", attempt, MAX_RETRIES, e)
            if "429" in err_str or "quota" in err_str.lower() or "exhausted" in err_str.lower():
                logger.warning("Gemini rate limited — skipping remaining retries")
                return None
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
    return None


def _call_openrouter(prompt: str) -> str | None:
    """Call OpenRouter (OpenAI-compatible API)."""
    api_key = os.getenv("OPENROUTER_API_KEY", "")
    if not api_key:
        logger.warning("OPENROUTER_API_KEY not set — skipping OpenRouter")
        return None

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = client.chat.completions.create(
                model="meta-llama/llama-3.3-70b-instruct",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4,
                max_tokens=8192,
            )
            return response.choices[0].message.content
        except Exception as e:
            err_str = str(e)
            logger.warning("OpenRouter attempt %d/%d failed: %s", attempt, MAX_RETRIES, e)
            if "429" in err_str or "rate" in err_str.lower() or "quota" in err_str.lower():
                logger.warning("OpenRouter rate limited — skipping remaining retries")
                return None
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
    return None


# ---------- Public API ----------

# Gemini first — most generous free tier and most reliable
PROVIDERS = [
    ("Gemini", _call_gemini),
    ("Groq", _call_groq),
    ("OpenRouter", _call_openrouter),
]


def call_llm(prompt: str) -> str | None:
    """
    Try each LLM provider in the fallback chain.
    Returns the first successful response text, or None if all fail.
    """
    for name, fn in PROVIDERS:
        logger.info("Trying LLM provider: %s", name)
        result = fn(prompt)
        if result:
            logger.info("LLM provider %s succeeded", name)
            return result
        logger.warning("LLM provider %s failed, trying next", name)

    logger.error("All LLM providers failed")
    return None

