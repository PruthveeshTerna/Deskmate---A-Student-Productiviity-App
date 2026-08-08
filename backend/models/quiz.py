import json
from extensions import db


class Quiz(db.Model):
    __tablename__ = "quizzes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    note_id = db.Column(db.Integer, db.ForeignKey("notes.id"), nullable=False, index=True)
    question = db.Column(db.Text, nullable=False)
    options_json = db.Column(db.Text, nullable=False)  # JSON array of option strings
    correct_answer = db.Column(db.String(255), nullable=False)

    def __init__(self, **kwargs):
        super(Quiz, self).__init__(**kwargs)

    def to_dict(self):
        try:
            options = json.loads(self.options_json)
        except (json.JSONDecodeError, TypeError):
            options = []
        return {
            "id": self.id,
            "note_id": self.note_id,
            "question": self.question,
            "options": options,
            "correct_answer": self.correct_answer,
        }
