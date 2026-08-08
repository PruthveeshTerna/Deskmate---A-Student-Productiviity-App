from datetime import datetime, timezone
from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    # Relationships
    tasks = db.relationship("Task", backref="user", lazy=True, cascade="all, delete-orphan")
    timetable_entries = db.relationship("TimetableEntry", backref="user", lazy=True, cascade="all, delete-orphan")
    notes = db.relationship("Note", backref="user", lazy=True, cascade="all, delete-orphan")
    pomodoro_sessions = db.relationship("PomodoroSession", backref="user", lazy=True, cascade="all, delete-orphan")
    study_goals = db.relationship("StudyGoal", backref="user", lazy=True, cascade="all, delete-orphan")
    crunch_plans = db.relationship("CrunchPlan", backref="user", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
