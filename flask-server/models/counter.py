from sqlalchemy import Column, Integer, String, DateTime
from config.database import db
from datetime import datetime

class Counter(db.Model):
    __tablename__ = 'counters'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), index=True, unique=True, nullable=False)
    value = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Counter {self.name}>'