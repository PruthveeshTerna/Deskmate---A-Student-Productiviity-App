"""
Shared Flask extension instances.
Defined separately to avoid circular imports between app.py and models.
"""
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

@app.route("/health/db", methods=["GET"])
def database_health():
    try:
        result = db.session.execute(text("SELECT 1"))
        result.scalar()

        return jsonify({
            "status": "ok",
            "sqlalchemy": "working",
            "database": "connected"
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "sqlalchemy": "failed",
            "database": "unavailable",
            "error": str(e)
        }), 500
