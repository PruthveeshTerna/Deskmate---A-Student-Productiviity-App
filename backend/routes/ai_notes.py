from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import logging

from extensions import db
from models.note import Note
from models.flashcard import Flashcard
from models.quiz import Quiz
from services.ai_notes_pipeline import run_ai_notes_pipeline

logger = logging.getLogger(__name__)

ai_notes_bp = Blueprint("ai_notes", __name__)


@ai_notes_bp.route("/ai-notes/generate", methods=["POST"])
@jwt_required()
def generate_ai_notes():
    """
    AI-Powered Notes Generator endpoint.
    Runs the 6-agent pipeline: content structurer → summarizer →
    diagram generator → flashcard extractor → quiz generator → formatter.
    """
    data = request.get_json(silent=True) or {}

    topic = (data.get("topic") or "").strip()
    content = (data.get("content") or "").strip()

    if not topic and not content:
        return jsonify({"error": "Either topic or content is required"}), 400

    try:
        result = run_ai_notes_pipeline(topic=topic or "Untitled", content=content)
    except Exception as e:
        import traceback
        logger.error("Pipeline crashed: %s\n%s", e, traceback.format_exc())
        return jsonify({"error": f"Internal pipeline crash: {str(e)}"}), 500

    # If the first agent (content structurer) failed, nothing useful was produced
    if result["structured_notes"] is None:
        return jsonify({
            "error": "AI service is temporarily unavailable. Please try again later.",
            "details": result.get("errors", []),
        }), 503

    # Try to save the note to the database
    note_id = None
    try:
        user_id = int(get_jwt_identity())
        
        # Generate a subject from the structured notes or topic
        structured_notes = result.get("structured_notes") or {}
        subject_title = topic or "Untitled AI Note"
        if isinstance(structured_notes, dict):
            subject_title = structured_notes.get("title", subject_title)
        
        # Ensure content is a string
        markdown_content = result.get("formatted_markdown") or ""
        if not isinstance(markdown_content, str):
            markdown_content = str(markdown_content)
        
        note = Note(
            user_id=user_id,
            title=str(subject_title)[:255],
            subject="AI Generated",
            content=markdown_content
        )
        db.session.add(note)
        db.session.flush()
        note_id = note.id

        # Save Flashcards
        flashcards_data = result.get("flashcards")
        if isinstance(flashcards_data, list):
            for fc in flashcards_data:
                if isinstance(fc, dict):
                    flashcard = Flashcard(
                        note_id=note.id,
                        question=str(fc.get("question", ""))[:5000],
                        answer=str(fc.get("answer", ""))[:5000]
                    )
                    db.session.add(flashcard)
                
        # Save Quiz
        quiz_data = result.get("quiz")
        if isinstance(quiz_data, list):
            for q in quiz_data:
                if isinstance(q, dict):
                    quiz_entry = Quiz(
                        note_id=note.id,
                        question=str(q.get("question", ""))[:5000],
                        options_json=json.dumps(q.get("options", [])),
                        correct_answer=str(q.get("correct_answer", ""))[:255]
                    )
                    db.session.add(quiz_entry)

        db.session.commit()
        logger.info("Saved AI note id=%s for user=%s", note.id, user_id)
    except Exception as e:
        logger.error("Failed to save AI note to database: %s", e, exc_info=True)
        db.session.rollback()

    try:
        return jsonify({
            "id": note_id,
            "structured_notes": result["structured_notes"],
            "summary": result["summary"],
            "diagrams": result["diagrams"],
            "flashcards": result["flashcards"],
            "quiz": result["quiz"],
            "formatted_markdown": result["formatted_markdown"],
        }), 200
    except Exception as e:
        logger.error("Failed to jsonify response: %s", e, exc_info=True)
        return jsonify({"error": f"Failed to serialize response: {str(e)}"}), 500

