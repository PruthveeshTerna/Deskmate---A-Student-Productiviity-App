from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.timetable import TimetableEntry

timetable_bp = Blueprint("timetable", __name__)

VALID_DAYS = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}


@timetable_bp.route("", methods=["GET"])
@jwt_required()
def list_entries():
    """Return all timetable entries for the authenticated user."""
    user_id = int(get_jwt_identity())
    entries = TimetableEntry.query.filter_by(user_id=user_id).all()
    return jsonify({"entries": [e.to_dict() for e in entries]}), 200


@timetable_bp.route("", methods=["POST"])
@jwt_required()
def create_entry():
    """Create a new timetable entry."""
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}

    subject = (data.get("subject") or "").strip()
    day = (data.get("day") or "").strip().title()
    start_time = (data.get("start_time") or "").strip()
    end_time = (data.get("end_time") or "").strip()

    if not subject:
        return jsonify({"error": "Subject is required"}), 400
    if day not in VALID_DAYS:
        return jsonify({"error": f"Day must be one of {', '.join(sorted(VALID_DAYS))}"}), 400
    if not start_time or not end_time:
        return jsonify({"error": "start_time and end_time are required"}), 400

    entry = TimetableEntry(
        user_id=user_id,
        subject=subject,
        day=day,
        start_time=start_time,
        end_time=end_time,
        room=(data.get("room") or "").strip(),
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify({"entry": entry.to_dict()}), 201


@timetable_bp.route("/<int:entry_id>", methods=["PUT"])
@jwt_required()
def update_entry(entry_id):
    """Update a timetable entry (partial update)."""
    user_id = int(get_jwt_identity())
    entry = TimetableEntry.query.filter_by(id=entry_id, user_id=user_id).first()
    if not entry:
        return jsonify({"error": "Timetable entry not found"}), 404

    data = request.get_json(silent=True) or {}

    if "subject" in data:
        entry.subject = (data["subject"] or "").strip() or entry.subject
    if "day" in data:
        day = (data["day"] or "").strip().title()
        if day and day in VALID_DAYS:
            entry.day = day
    if "start_time" in data:
        entry.start_time = (data["start_time"] or "").strip() or entry.start_time
    if "end_time" in data:
        entry.end_time = (data["end_time"] or "").strip() or entry.end_time
    if "room" in data:
        entry.room = (data["room"] or "").strip()

    db.session.commit()
    return jsonify({"entry": entry.to_dict()}), 200


@timetable_bp.route("/<int:entry_id>", methods=["DELETE"])
@jwt_required()
def delete_entry(entry_id):
    """Delete a timetable entry."""
    user_id = int(get_jwt_identity())
    entry = TimetableEntry.query.filter_by(id=entry_id, user_id=user_id).first()
    if not entry:
        return jsonify({"error": "Timetable entry not found"}), 404

    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": "Timetable entry deleted"}), 200
