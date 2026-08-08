from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, jwt


def create_app(config_class=Config):
    """Application factory."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # CORS — allow the Next.js dev server (default port 3000)
    CORS(
        app,
        resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:5173"]}},
        supports_credentials=True,
    )

    # Extensions
    db.init_app(app)
    jwt.init_app(app)

    # -----------------------------------------------------------------------
    # Register blueprints
    # -----------------------------------------------------------------------
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

    # Create tables on first request (dev convenience)
    with app.app_context():
        # Import all models so SQLAlchemy sees them
        import models  # noqa: F401
        db.create_all()

    return app


# ---------------------------------------------------------------------------
# Dev entry-point:  python app.py
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    application = create_app()
    application.run(debug=True, port=5000)
