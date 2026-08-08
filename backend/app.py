from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import text

from config import Config
from extensions import db, jwt


def create_app(config_class=Config):
    """Application factory."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # CORS
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:3000",
                    "http://localhost:5173",
                    "https://deskmate-a-student-productiviity-g5u0222uw.vercel.app/"
                ]
            }
        },
        supports_credentials=True,
    )

    # Extensions
    db.init_app(app)
    jwt.init_app(app)

    # Health check
    @app.route("/health")
    def health():
        return jsonify({
            "status": "ok",
            "service": "deskmate-backend"
        }), 200

    # Database health check
    @app.route("/health/db")
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
            db.session.rollback()

            return jsonify({
                "status": "error",
                "sqlalchemy": "failed",
                "database": "unavailable",
                "error": str(e)
            }), 500

    # Register blueprints
    from routes.auth import auth_bp
    from routes.tasks import tasks_bp
    from routes.timetable import timetable_bp
    from routes.notes import notes_bp
    from routes.pomodoro import pomodoro_bp
    from routes.analytics import analytics_bp
    from routes.crunch import crunch_bp
    from routes.ai_notes import ai_notes_bp
    from routes.notifications import notifications_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(tasks_bp, url_prefix="/api/tasks")
    app.register_blueprint(timetable_bp, url_prefix="/api/timetable")
    app.register_blueprint(notes_bp, url_prefix="/api/notes")
    app.register_blueprint(pomodoro_bp, url_prefix="/api")
    app.register_blueprint(analytics_bp, url_prefix="/api")
    app.register_blueprint(crunch_bp, url_prefix="/api")
    app.register_blueprint(ai_notes_bp, url_prefix="/api")
    app.register_blueprint(notifications_bp, url_prefix="/api")

    # Create tables
    with app.app_context():
        import models  # noqa: F401
        db.create_all()

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
