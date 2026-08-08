from datetime import date, timedelta
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

from extensions import db
from models.task import Task
from models.pomodoro import PomodoroSession
from models.note import Note
from models.flashcard import Flashcard

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/analytics", methods=["GET"])
@jwt_required()
def get_analytics():
    """Return aggregated analytics data for charts and insights."""
    user_id = int(get_jwt_identity())
    today = date.today()

    # ---- Tasks completed vs pending ----
    tasks_completed = Task.query.filter_by(user_id=user_id, completed=True).count()
    tasks_pending = Task.query.filter_by(user_id=user_id, completed=False).count()

    # ---- Study time per subject (from Pomodoro sessions) ----
    subject_rows = (
        db.session.query(
            PomodoroSession.subject,
            func.sum(PomodoroSession.duration_minutes),
        )
        .filter_by(user_id=user_id)
        .group_by(PomodoroSession.subject)
        .all()
    )
    study_time_by_subject = {}
    for subj, total in subject_rows:
        key = subj if subj else "Unassigned"
        study_time_by_subject[key] = int(total or 0)

    # ---- Weekly productivity trend (last 7 days) ----
    weekly_trend = []
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        # Tasks completed on this day
        completed_count = (
            Task.query
            .filter_by(user_id=user_id, completed=True)
            .filter(func.date(Task.created_at) == d)
            .count()
        )
        # Pomodoro minutes on this day
        minutes = (
            db.session.query(func.sum(PomodoroSession.duration_minutes))
            .filter_by(user_id=user_id)
            .filter(func.date(PomodoroSession.completed_at) == d)
            .scalar()
        ) or 0

        weekly_trend.append({
            "date": d.isoformat(),
            "tasks_completed": completed_count,
            "study_minutes": int(minutes),
        })

    # ---- Real Metrics Calculation ----
    flashcards_created = (
        db.session.query(func.count(Flashcard.id))
        .join(Note, Flashcard.note_id == Note.id)
        .filter(Note.user_id == user_id)
        .scalar()
    ) or 0

    total_recent_mins = sum(d["study_minutes"] for d in weekly_trend)
    # Target 600 mins per week (~1.5h/day) for retention
    focus_retention = min(100, int((total_recent_mins / 600.0) * 100)) if total_recent_mins > 0 else 0
    # Score based on base + tasks + study time
    focus_score = min(100, 40 + tasks_completed * 2 + int(total_recent_mins / 20)) if (tasks_completed > 0 or total_recent_mins > 0) else 0

    # ---- Simple rule-based suggestions ----
    suggestions = _generate_suggestions(weekly_trend, tasks_pending, tasks_completed)

    return jsonify({
        "tasks_completed": tasks_completed,
        "tasks_pending": tasks_pending,
        "study_time_by_subject": study_time_by_subject,
        "weekly_trend": weekly_trend,
        "suggestions": suggestions,
        "focus_score": focus_score,
        "focus_retention": focus_retention,
        "cards_created": flashcards_created,
    }), 200


def _generate_suggestions(weekly_trend, tasks_pending, tasks_completed):
    """Simple rule-based improvement suggestions."""
    suggestions = []

    if len(weekly_trend) >= 7:
        # Compare this half-week vs last half-week
        recent_tasks = sum(d["tasks_completed"] for d in weekly_trend[-3:])
        earlier_tasks = sum(d["tasks_completed"] for d in weekly_trend[:3])
        recent_mins = sum(d["study_minutes"] for d in weekly_trend[-3:])
        earlier_mins = sum(d["study_minutes"] for d in weekly_trend[:3])

        if recent_tasks < earlier_tasks:
            suggestions.append(
                "Your task completion has dipped recently. Try breaking tasks into smaller chunks."
            )
        elif recent_tasks > earlier_tasks:
            suggestions.append(
                "Great momentum! You've been completing more tasks recently. Keep it up! 🚀"
            )

        if recent_mins < earlier_mins and earlier_mins > 0:
            suggestions.append(
                "Your study time has decreased. Consider scheduling dedicated focus blocks."
            )
        elif recent_mins > earlier_mins:
            suggestions.append(
                "Your study time is trending up — nice work! 📈"
            )

    if tasks_pending > 10:
        suggestions.append(
            f"You have {tasks_pending} pending tasks. Consider prioritizing the most urgent ones."
        )

    total = tasks_completed + tasks_pending
    if total > 0 and tasks_completed / total > 0.8:
        suggestions.append(
            "You've completed over 80% of your tasks — outstanding! 🌟"
        )

    if not suggestions:
        suggestions.append("Keep up the steady work! Consistency is key to academic success. 💪")

    return suggestions
