from extensions import db


class StudyGoal(db.Model):
    __tablename__ = "study_goals"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    date = db.Column(db.Date, nullable=False, index=True)
    target_minutes = db.Column(db.Integer, nullable=False, default=60)
    achieved_minutes = db.Column(db.Integer, nullable=False, default=0)

    # Composite unique: one goal per user per day
    __table_args__ = (db.UniqueConstraint("user_id", "date", name="uq_user_date"),)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "date": self.date.isoformat() if self.date else None,
            "target_minutes": self.target_minutes,
            "achieved_minutes": self.achieved_minutes,
        }
