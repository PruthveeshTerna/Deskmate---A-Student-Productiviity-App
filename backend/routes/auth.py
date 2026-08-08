from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
import bcrypt

from extensions import db
from models.user import User
from models.notification import Notification

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    """Register a new user. Returns user info + JWT token."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    # Validation
    if not name:
        return jsonify({"error": "Name is required"}), 400
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    # Check duplicate
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with this email already exists"}), 409

    # Hash password
    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    user = User(name=name, email=email, password_hash=password_hash)
    db.session.add(user)
    db.session.flush() # Get user.id

    welcome_notification = Notification(
        user_id=user.id,
        title="Welcome to DeskMate! 🎉",
        message="We're glad to have you here. Start by adding a task or jumping into a focus session."
    )
    db.session.add(welcome_notification)
    
    db.session.commit()
    token = create_access_token(identity=str(user.id))

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "token": token,
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate a user. Returns user info + JWT token."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    try:
        is_valid = bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8"))
        if not is_valid:
            return jsonify({"error": "Invalid email or password"}), 401
    except ValueError:
        # If the stored hash is not a valid bcrypt hash (e.g. mock data), checkpw raises ValueError
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "token": token,
    }), 200
