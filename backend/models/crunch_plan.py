import json
from datetime import datetime, timezone
from extensions import db


class CrunchPlan(db.Model):
    __tablename__ = "crunch_plans"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    subject = db.Column(db.String(120), nullable=False)
    generated_plan_json = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        try:
            plan = json.loads(self.generated_plan_json)
        except (json.JSONDecodeError, TypeError):
            plan = {}
        return {
            "id": self.id,
            "user_id": self.user_id,
            "subject": self.subject,
            "plan": plan,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
