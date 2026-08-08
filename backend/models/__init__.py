# Import all models so that db.create_all() discovers them.
from models.user import User  # noqa: F401
from models.task import Task  # noqa: F401
from models.timetable import TimetableEntry  # noqa: F401
from models.note import Note  # noqa: F401
from models.flashcard import Flashcard  # noqa: F401
from models.quiz import Quiz  # noqa: F401
from models.pomodoro import PomodoroSession  # noqa: F401
from models.study_goal import StudyGoal  # noqa: F401
from models.crunch_plan import CrunchPlan  # noqa: F401
from models.notification import Notification  # noqa: F401
