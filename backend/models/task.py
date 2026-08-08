from datetime import datetime, timezone
from extensions import db


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True, default="")
    due_date = db.Column(db.DateTime, nullable=True, index=True)
    priority = db.Column(db.String(20), nullable=True, default="medium")  # low / medium / high
    subject = db.Column(db.String(120), nullable=True, default="")
    completed = db.Column(db.Boolean, default=False, index=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description or "",
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "priority": self.priority or "medium",
            "subject": self.subject or "",
            "completed": self.completed,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
