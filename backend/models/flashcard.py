from extensions import db


class Flashcard(db.Model):
    __tablename__ = "flashcards"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    note_id = db.Column(db.Integer, db.ForeignKey("notes.id"), nullable=False, index=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)

    def __init__(self, **kwargs):
        super(Flashcard, self).__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "note_id": self.note_id,
            "question": self.question,
            "answer": self.answer,
        }
