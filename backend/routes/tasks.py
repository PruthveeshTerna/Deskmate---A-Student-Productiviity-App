from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.task import Task

tasks_bp = Blueprint("tasks", __name__)


def _parse_due_date(raw):
    """Try to parse an ISO-format date string. Return None on failure."""
    if not raw:
        return None
    try:
        return datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except (ValueError, TypeError):
        return None


@tasks_bp.route("", methods=["GET"])
@jwt_required()
def list_tasks():
    """Return all tasks for the authenticated user."""
    user_id = int(get_jwt_identity())
    tasks = Task.query.filter_by(user_id=user_id).order_by(Task.created_at.desc()).all()
    return jsonify({"tasks": [t.to_dict() for t in tasks]}), 200


@tasks_bp.route("", methods=["POST"])
@jwt_required()
def create_task():
    """Create a new task."""
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400

    task = Task(
        user_id=user_id,
        title=title,
        description=(data.get("description") or "").strip(),
        due_date=_parse_due_date(data.get("due_date")),
        priority=data.get("priority", "medium"),
        subject=(data.get("subject") or "").strip(),
        completed=bool(data.get("completed", False)),
    )
    db.session.add(task)
    db.session.flush() # get task.id
    
    # Generate a notification that the task was created
    from models.notification import Notification
    db.session.add(Notification(
        user_id=user_id,
        title="New Task Created ✅",
        message=f"Task '{task.title}' was added successfully."
    ))

    db.session.commit()
    return jsonify({"task": task.to_dict()}), 201


@tasks_bp.route("/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    """Update an existing task (partial update)."""
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json(silent=True) or {}

    if "title" in data:
        task.title = (data["title"] or "").strip() or task.title
    if "description" in data:
        task.description = (data["description"] or "").strip()
    if "due_date" in data:
        task.due_date = _parse_due_date(data["due_date"])
    if "priority" in data:
        task.priority = data["priority"]
    if "subject" in data:
        task.subject = (data["subject"] or "").strip()
    if "completed" in data:
        task.completed = bool(data["completed"])

    db.session.commit()
    return jsonify({"task": task.to_dict()}), 200


@tasks_bp.route("/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    """Delete a task."""
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"}), 200


@tasks_bp.route("/upcoming", methods=["GET"])
@jwt_required()
def upcoming_tasks():
    """Return incomplete tasks sorted by nearest due date."""
    user_id = int(get_jwt_identity())
    tasks = (
        Task.query
        .filter_by(user_id=user_id, completed=False)
        .filter(Task.due_date.isnot(None))
        .order_by(Task.due_date.asc())
        .all()
    )
    return jsonify({"tasks": [t.to_dict() for t in tasks]}), 200
