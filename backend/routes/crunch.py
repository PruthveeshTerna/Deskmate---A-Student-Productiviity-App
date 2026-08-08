import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.crunch_plan import CrunchPlan
from services.llm_fallback import call_llm

crunch_bp = Blueprint("crunch", __name__)


@crunch_bp.route("/crunch", methods=["POST"])
@jwt_required()
def crunch_study():
    """
    Crunch Study Helper — given a subject/topic and available time,
    AI generates a prioritized revision plan with flashcards and quiz.
    """
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    subject = (data.get("subject") or "").strip()
    topic = (data.get("topic") or "").strip()
    available_minutes = data.get("available_minutes")

    if not subject:
        return jsonify({"error": "Subject is required"}), 400
    if not available_minutes or not isinstance(available_minutes, (int, float)) or available_minutes <= 0:
        return jsonify({"error": "available_minutes must be a positive number"}), 400

    topic_text = f" (topic: {topic})" if topic else ""

    prompt = f"""You are an expert study coach. A student needs to cram for {subject}{topic_text} and has {int(available_minutes)} minutes.

Create a prioritized revision plan. Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{{
  "topics": [
    {{
      "name": "topic name",
      "priority": "high" | "medium" | "low",
      "time_minutes": <number>,
      "key_points": ["point 1", "point 2"]
    }}
  ],
  "flashcards": [
    {{"question": "...", "answer": "..."}}
  ],
  "quiz": [
    {{
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "the correct option text"
    }}
  ]
}}

Generate 3-6 topics, 5 flashcards, and 3 quiz questions for the highest-priority topics.
Total time_minutes across all topics must not exceed {int(available_minutes)}."""

    result = call_llm(prompt)
    if result is None:
        return jsonify({"error": "AI service is temporarily unavailable. Please try again later."}), 503

    # Parse the JSON response
    try:
        cleaned = result.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

        plan = json.loads(cleaned)
        if not isinstance(plan, dict):
            raise ValueError("Expected a JSON object")
    except (json.JSONDecodeError, ValueError):
        return jsonify({"error": "AI returned an invalid response. Please try again."}), 502

    # Store the plan
    crunch = CrunchPlan(
        user_id=user_id,
        subject=subject,
        generated_plan_json=json.dumps(plan),
    )
    db.session.add(crunch)
    db.session.commit()

    return jsonify({"plan": plan}), 200
