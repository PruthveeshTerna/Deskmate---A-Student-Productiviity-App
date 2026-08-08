from datetime import datetime, timezone
from extensions import db


class PomodoroSession(db.Model):
    __tablename__ = "pomodoro_sessions"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"), nullable=True)
    subject = db.Column(db.String(120), nullable=True, default="")
    duration_minutes = db.Column(db.Integer, nullable=False)
    completed_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "task_id": self.task_id,
            "subject": self.subject or "",
            "duration_minutes": self.duration_minutes,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
        }
