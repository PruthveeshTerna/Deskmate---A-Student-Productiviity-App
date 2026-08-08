"""
AI-Powered Notes Generator — 6-Agent LangChain Pipeline
========================================================
Orchestrates 6 agents to transform a syllabus topic or raw content into
comprehensive structured notes:

1. Content Structurer — organizes raw content into logical sections
2. Summarizer — creates concise summaries per section
3. Diagram/Workflow Generator — produces Mermaid diagrams or plain-text flowcharts
4. Flashcard Extractor — extracts key Q&A pairs
5. Quiz Generator — generates MCQs from the content
6. Formatter/Compiler — compiles everything into final structured markdown

Uses the LLM fallback chain at every step.
"""

import json
import logging
import concurrent.futures

from services.llm_fallback import call_llm

logger = logging.getLogger(__name__)


def _clean_json(raw: str) -> str:
    """Strip markdown code fences and chatter from an LLM response."""
    import re
    cleaned = raw.strip()
    
    # Try to find a JSON object or array
    match = re.search(r'(\{.*\}|\[.*\])', cleaned, re.DOTALL)
    if match:
        return match.group(1)
        
    return cleaned


def _fix_json_escapes(s: str) -> str:
    """Fix invalid JSON escape sequences (e.g. \\( from LaTeX math notation).
    
    Valid JSON escapes are: \" \\\\ \\/ \\b \\f \\n \\r \\t \\uXXXX
    Anything else like \\( \\) \\vec etc. is invalid and must be double-escaped.
    """
    import re
    return re.sub(r'\\(?!["\\/bfnrtu])', r'\\\\', s)


def _safe_parse_json(raw: str | None, default=None):
    """Parse JSON from LLM output, returning default on failure."""
    if not raw:
        return default
    cleaned = _clean_json(raw)
    # First try direct parse
    try:
        return json.loads(cleaned)
    except (json.JSONDecodeError, ValueError):
        pass
    # Second try: fix invalid escape sequences (common with LaTeX in Gemini output)
    try:
        return json.loads(_fix_json_escapes(cleaned))
    except (json.JSONDecodeError, ValueError):
        logger.warning("JSON parse failed even after escape fixing. Raw (first 300 chars): %s", cleaned[:300])
        return default


# ---------------------------------------------------------------------------
# Individual Agents
# ---------------------------------------------------------------------------

def generate_all_materials(topic: str, content: str) -> dict | None:
    """Single agent that generates structured notes, summaries, flashcards, and quizzes in ONE call."""
    prompt = f"""You are a Master Educator agent. Generate highly detailed study notes, summaries, flashcards, and quizzes.

TOPIC: {topic}
RAW CONTENT: {content if content else "None provided. Use your extensive knowledge."}

Return ONLY a valid JSON object matching this structure exactly:
{{
  "structured_notes": {{
    "title": "Main topic title",
    "sections": [
      {{
        "heading": "Section heading",
        "content": "Deep theoretical explanations, formulas, and examples."
      }}
    ]
  }},
  "summary": {{
    "overall_summary": "2-3 sentence overview",
    "section_summaries": [
      {{ "heading": "Section heading", "summary": "Concise summary" }}
    ]
  }},
  "flashcards": [
    {{ "q": "Clear question", "a": "Detailed answer" }}
  ],
  "quiz": [
    {{ "q": "Question", "options": ["A", "B", "C", "D"], "correct_index": 0 }}
  ]
}}

CRITICAL RULES:
1. Output MUST be strictly valid JSON.
2. Escape all newlines as \\n inside strings. Do NOT use literal multi-line strings.
3. Include 2-3 detailed sections, 4-6 flashcards, and 4-6 quiz questions.
"""
    result = call_llm(prompt)
    return _safe_parse_json(result, default=None)

def format_markdown_in_python(data: dict) -> str:
    """Format the generated JSON into a beautiful Markdown document locally (saves 1 LLM call)."""
    md = []
    
    # Title
    title = data.get("structured_notes", {}).get("title", "Study Notes")
    md.append(f"# {title}\n")
    
    # Overall summary
    overall_summary = data.get("summary", {}).get("overall_summary", "")
    if overall_summary:
        md.append(f"> **Overview**: {overall_summary}\n")
    
    # Sections
    sections = data.get("structured_notes", {}).get("sections", [])
    for sec in sections:
        h = sec.get("heading", "")
        c = sec.get("content", "")
        if h and c:
            md.append(f"## {h}\n\n{c}\n")
            
    # Flashcards
    flashcards = data.get("flashcards", [])
    if flashcards:
        md.append("## Flashcards\n")
        md.append("| Question | Answer |")
        md.append("|---|---|")
        for fc in flashcards:
            q = str(fc.get("q", "")).replace("\n", " ").replace("|", "\\|")
            a = str(fc.get("a", "")).replace("\n", " ").replace("|", "\\|")
            md.append(f"| {q} | {a} |")
        md.append("\n")
        
    # Quiz
    quiz = data.get("quiz", [])
    if quiz:
        md.append("## Practice Quiz\n")
        for i, qz in enumerate(quiz, 1):
            q = qz.get("q", "")
            md.append(f"**{i}. {q}**\n")
            for j, opt in enumerate(qz.get("options", [])):
                letter = ["A", "B", "C", "D", "E"][j % 5]
                md.append(f"- {letter}) {opt}")
            md.append("\n")

    return "\n".join(md)

# ---------------------------------------------------------------------------
# Pipeline Orchestrator
# ---------------------------------------------------------------------------

def run_ai_notes_pipeline(topic: str, content: str = "") -> dict:
    """
    Run the ultra-fast single-agent pipeline and return structured results.
    """
    result = {
        "structured_notes": None,
        "summary": None,
        "diagrams": None,
        "flashcards": None,
        "quiz": None,
        "formatted_markdown": None,
        "errors": [],
    }

    logger.info("AI Notes Pipeline — Generating all materials in one pass")
    data = generate_all_materials(topic, content)
    
    if not data:
        result["errors"].append("AI generation failed or returned invalid JSON")
        return result

    result["structured_notes"] = data.get("structured_notes")
    result["summary"] = data.get("summary")
    result["flashcards"] = data.get("flashcards")
    result["quiz"] = data.get("quiz")
    
    logger.info("AI Notes Pipeline — Formatting Markdown locally")
    result["formatted_markdown"] = format_markdown_in_python(data)

    return result
