import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.note import Note
from models.flashcard import Flashcard
from models.quiz import Quiz
from services.llm_fallback import call_llm

notes_bp = Blueprint("notes", __name__)


# ---------------------------------------------------------------------------
# Notes CRUD
# ---------------------------------------------------------------------------

@notes_bp.route("", methods=["GET"])
@jwt_required()
def list_notes():
    """Return all notes for the authenticated user."""
    user_id = int(get_jwt_identity())
    notes = Note.query.filter_by(user_id=user_id).order_by(Note.created_at.desc()).all()
    return jsonify({"notes": [n.to_dict() for n in notes]}), 200


@notes_bp.route("", methods=["POST"])
@jwt_required()
def create_note():
    """Create a new note."""
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400

    note = Note(
        user_id=user_id,
        title=title,
        subject=(data.get("subject") or "").strip(),
        content=(data.get("content") or "").strip(),
    )
    db.session.add(note)
    db.session.commit()
    return jsonify({"note": note.to_dict()}), 201


@notes_bp.route("/<int:note_id>", methods=["PUT"])
@jwt_required()
def update_note(note_id):
    """Update an existing note (partial update)."""
    user_id = int(get_jwt_identity())
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    if not note:
        return jsonify({"error": "Note not found"}), 404

    data = request.get_json(silent=True) or {}

    if "title" in data:
        note.title = (data["title"] or "").strip() or note.title
    if "subject" in data:
        note.subject = (data["subject"] or "").strip()
    if "content" in data:
        note.content = (data["content"] or "").strip()

    db.session.commit()
    return jsonify({"note": note.to_dict()}), 200


@notes_bp.route("/<int:note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    """Delete a note and its related flashcards/quizzes."""
    user_id = int(get_jwt_identity())
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    if not note:
        return jsonify({"error": "Note not found"}), 404

    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted"}), 200


# ---------------------------------------------------------------------------
# AI — Flashcard generation
# ---------------------------------------------------------------------------

@notes_bp.route("/<int:note_id>/flashcards", methods=["POST"])
@jwt_required()
def generate_flashcards(note_id):
    """Send note content to AI, return and store flashcard Q&A pairs."""
    user_id = int(get_jwt_identity())
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    if not note:
        return jsonify({"error": "Note not found"}), 404
    if not (note.content or "").strip():
        return jsonify({"error": "Note has no content to generate flashcards from"}), 400

    prompt = (
        "You are an expert educator. Given the following study notes, generate 5-10 flashcards. "
        "Return ONLY a valid JSON array of objects, each with \"question\" and \"answer\" keys. "
        "No markdown, no explanation — just the JSON array.\n\n"
        f"NOTES:\n{note.content}"
    )

    result = call_llm(prompt)
    if result is None:
        return jsonify({"error": "AI service is temporarily unavailable. Please try again later."}), 503

    # Parse the JSON array from the LLM response
    try:
        # Strip markdown code fences if present
        cleaned = result.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

        cards = json.loads(cleaned)
        if not isinstance(cards, list):
            raise ValueError("Expected a JSON array")
    except (json.JSONDecodeError, ValueError):
        return jsonify({"error": "AI returned an invalid response. Please try again."}), 502

    # Delete old flashcards for this note, then insert new ones
    Flashcard.query.filter_by(note_id=note.id).delete()

    new_cards = []
    for item in cards:
        q = (item.get("question") or "").strip()
        a = (item.get("answer") or "").strip()
        if q and a:
            fc = Flashcard(note_id=note.id, question=q, answer=a)
            db.session.add(fc)
            new_cards.append(fc)

    db.session.commit()
    return jsonify({"flashcards": [fc.to_dict() for fc in new_cards]}), 200


# ---------------------------------------------------------------------------
# AI — Quiz generation
# ---------------------------------------------------------------------------

@notes_bp.route("/<int:note_id>/quiz", methods=["POST"])
@jwt_required()
def generate_quiz(note_id):
    """Send note content to AI, return and store MCQ quiz."""
    user_id = int(get_jwt_identity())
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()
    if not note:
        return jsonify({"error": "Note not found"}), 404
    if not (note.content or "").strip():
        return jsonify({"error": "Note has no content to generate a quiz from"}), 400

    prompt = (
        "You are an expert educator. Given the following study notes, generate 5-10 multiple-choice questions. "
        "Each question must have exactly 4 options (A, B, C, D). "
        "Return ONLY a valid JSON array of objects with keys: \"question\", \"options\" (array of 4 strings), "
        "and \"correct_answer\" (the correct option text). No markdown, no explanation — just the JSON array.\n\n"
        f"NOTES:\n{note.content}"
    )

    result = call_llm(prompt)
    if result is None:
        return jsonify({"error": "AI service is temporarily unavailable. Please try again later."}), 503

    # Parse the JSON array from the LLM response
    try:
        cleaned = result.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

        questions = json.loads(cleaned)
        if not isinstance(questions, list):
            raise ValueError("Expected a JSON array")
    except (json.JSONDecodeError, ValueError):
        return jsonify({"error": "AI returned an invalid response. Please try again."}), 502

    # Delete old quizzes for this note, then insert new ones
    Quiz.query.filter_by(note_id=note.id).delete()

    new_quizzes = []
    for item in questions:
        q = (item.get("question") or "").strip()
        opts = item.get("options", [])
        correct = (item.get("correct_answer") or "").strip()
        if q and isinstance(opts, list) and len(opts) >= 2 and correct:
            quiz = Quiz(
                note_id=note.id,
                question=q,
                options_json=json.dumps(opts),
                correct_answer=correct,
            )
            db.session.add(quiz)
            new_quizzes.append(quiz)

    db.session.commit()
    return jsonify({"quiz": [qz.to_dict() for qz in new_quizzes]}), 200
