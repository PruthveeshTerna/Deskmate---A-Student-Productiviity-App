from datetime import datetime, timezone
from extensions import db


class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    subject = db.Column(db.String(120), nullable=True, default="")
    content = db.Column(db.Text, nullable=True, default="")
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    flashcards = db.relationship("Flashcard", backref="note", lazy=True, cascade="all, delete-orphan")
    quizzes = db.relationship("Quiz", backref="note", lazy=True, cascade="all, delete-orphan")

    def __init__(self, **kwargs):
        super(Note, self).__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "subject": self.subject or "",
            "content": self.content or "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
