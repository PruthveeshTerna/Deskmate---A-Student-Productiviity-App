from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.notification import Notification
import logging

logger = logging.getLogger(__name__)

notifications_bp = Blueprint("notifications", __name__)

from datetime import datetime, timezone
from models.task import Task

@notifications_bp.route("/notifications", methods=["GET"])
@jwt_required()
def get_notifications():
    try:
        user_id = get_jwt_identity()
        
        # Check for missed deadlines
        now = datetime.now(timezone.utc)
        overdue_tasks = Task.query.filter(
            Task.user_id == user_id, 
            Task.completed == False, 
            Task.due_date != None,
            Task.due_date < now
        ).all()
        
        new_notifications_added = False
        for task in overdue_tasks:
            msg = f"Task '{task.title}' missed its deadline."
            # Check if this specific notification already exists
            existing = Notification.query.filter_by(user_id=user_id, title="Task Overdue ⚠️", message=msg).first()
            if not existing:
                db.session.add(Notification(
                    user_id=user_id,
                    title="Task Overdue ⚠️",
                    message=msg
                ))
                new_notifications_added = True
                
        if new_notifications_added:
            db.session.commit()

        notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
        return jsonify([n.to_dict() for n in notifications]), 200
    except Exception as e:
        logger.error(f"Error fetching notifications: {e}")
        return jsonify({"error": "Failed to fetch notifications"}), 500

@notifications_bp.route("/notifications/<int:notification_id>/read", methods=["PUT"])
@jwt_required()
def mark_as_read(notification_id):
    try:
        user_id = get_jwt_identity()
        notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
        
        if not notification:
            return jsonify({"error": "Notification not found"}), 404
            
        notification.is_read = True
        db.session.commit()
        return jsonify({"message": "Notification marked as read"}), 200
    except Exception as e:
        logger.error(f"Error marking notification as read: {e}")
        return jsonify({"error": "Failed to mark notification as read"}), 500

@notifications_bp.route("/notifications/read-all", methods=["POST"])
@jwt_required()
def mark_all_as_read():
    try:
        user_id = get_jwt_identity()
        Notification.query.filter_by(user_id=user_id, is_read=False).update({"is_read": True})
        db.session.commit()
        return jsonify({"message": "All notifications marked as read"}), 200
    except Exception as e:
        logger.error(f"Error marking all notifications as read: {e}")
        return jsonify({"error": "Failed to mark all notifications as read"}), 500
