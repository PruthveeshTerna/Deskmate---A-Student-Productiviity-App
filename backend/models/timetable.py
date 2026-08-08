from extensions import db


class TimetableEntry(db.Model):
    __tablename__ = "timetable"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    subject = db.Column(db.String(120), nullable=False)
    day = db.Column(db.String(20), nullable=False)  # Monday, Tuesday, …
    start_time = db.Column(db.String(10), nullable=False)  # HH:MM
    end_time = db.Column(db.String(10), nullable=False)  # HH:MM
    room = db.Column(db.String(60), nullable=True, default="")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "subject": self.subject,
            "day": self.day,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "room": self.room or "",
        }
