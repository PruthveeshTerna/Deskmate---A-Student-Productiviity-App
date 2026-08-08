from datetime import datetime, date, timedelta, timezone
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

from extensions import db
from models.pomodoro import PomodoroSession
from models.study_goal import StudyGoal

pomodoro_bp = Blueprint("pomodoro", __name__)


# ---------------------------------------------------------------------------
# Pomodoro sessions
# ---------------------------------------------------------------------------

@pomodoro_bp.route("/pomodoro", methods=["POST"])
@jwt_required()
def log_session():
    """Log a completed Pomodoro session."""
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    duration = data.get("duration_minutes")
    if not duration or not isinstance(duration, (int, float)) or duration <= 0:
        return jsonify({"error": "duration_minutes must be a positive number"}), 400

    session = PomodoroSession(
        user_id=user_id,
        task_id=data.get("task_id"),
        subject=(data.get("subject") or "").strip(),
        duration_minutes=int(duration),
    )
    db.session.add(session)

    # Also update achieved_minutes for today's study goal if one exists
    today = date.today()
    goal = StudyGoal.query.filter_by(user_id=user_id, date=today).first()
    if goal:
        goal.achieved_minutes += int(duration)

    db.session.commit()
    return jsonify({"session": session.to_dict()}), 201


@pomodoro_bp.route("/pomodoro/streak", methods=["GET"])
@jwt_required()
def get_streak():
    """Return the current streak (consecutive days with ≥1 completed session)."""
    user_id = int(get_jwt_identity())

    # Get distinct dates with at least one session, ordered descending
    rows = (
        db.session.query(func.date(PomodoroSession.completed_at))
        .filter_by(user_id=user_id)
        .group_by(func.date(PomodoroSession.completed_at))
        .order_by(func.date(PomodoroSession.completed_at).desc())
        .all()
    )

    if not rows:
        return jsonify({"streak": 0}), 200

    dates = [row[0] for row in rows if row[0] is not None]
    # Convert to date objects if they're strings
    clean_dates = []
    for d in dates:
        if isinstance(d, str):
            clean_dates.append(date.fromisoformat(d))
        elif isinstance(d, date):
            clean_dates.append(d)
    clean_dates.sort(reverse=True)

    if not clean_dates:
        return jsonify({"streak": 0}), 200

    streak = 1
    today = date.today()
    # Streak must include today or yesterday
    if clean_dates[0] < today - timedelta(days=1):
        return jsonify({"streak": 0}), 200

    for i in range(1, len(clean_dates)):
        if clean_dates[i - 1] - clean_dates[i] == timedelta(days=1):
            streak += 1
        else:
            break

    return jsonify({"streak": streak}), 200


# ---------------------------------------------------------------------------
# Study goals
# ---------------------------------------------------------------------------

@pomodoro_bp.route("/study-goals", methods=["GET"])
@jwt_required()
def get_goal():
    """Get study goal for a specific date (default: today)."""
    user_id = int(get_jwt_identity())
    raw_date = request.args.get("date")

    try:
        target_date = date.fromisoformat(raw_date) if raw_date else date.today()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    goal = StudyGoal.query.filter_by(user_id=user_id, date=target_date).first()
    if not goal:
        return jsonify({"goal": None}), 200

    return jsonify({"goal": goal.to_dict()}), 200


@pomodoro_bp.route("/study-goals", methods=["POST"])
@jwt_required()
def set_goal():
    """Create or update a daily study goal."""
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    raw_date = data.get("date")
    target_minutes = data.get("target_minutes")

    try:
        target_date = date.fromisoformat(raw_date) if raw_date else date.today()
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    if not target_minutes or not isinstance(target_minutes, (int, float)) or target_minutes <= 0:
        return jsonify({"error": "target_minutes must be a positive number"}), 400

    goal = StudyGoal.query.filter_by(user_id=user_id, date=target_date).first()
    if goal:
        goal.target_minutes = int(target_minutes)
    else:
        goal = StudyGoal(
            user_id=user_id,
            date=target_date,
            target_minutes=int(target_minutes),
        )
        db.session.add(goal)

    db.session.commit()
    return jsonify({"goal": goal.to_dict()}), 201


@pomodoro_bp.route("/study-goals/<int:goal_id>", methods=["PUT"])
@jwt_required()
def update_goal(goal_id):
    """Update achieved minutes for a study goal."""
    user_id = int(get_jwt_identity())
    goal = StudyGoal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({"error": "Study goal not found"}), 404

    data = request.get_json(silent=True) or {}

    if "achieved_minutes" in data:
        goal.achieved_minutes = int(data["achieved_minutes"])
    if "target_minutes" in data:
        goal.target_minutes = int(data["target_minutes"])

    db.session.commit()
    return jsonify({"goal": goal.to_dict()}), 200
