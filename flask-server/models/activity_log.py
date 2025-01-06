from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from config.database import db
from datetime import datetime

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    action = Column(String(50))  # e.g., 'generate_cards', 'generate_qr', etc.
    card_id = Column(Integer, ForeignKey('cards.id'), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship('User', back_populates='activity_logs')
    card = relationship('Card', backref='activity_logs')

    def __repr__(self):
        return f'<ActivityLog {self.action} by user {self.user_id} on card {self.card_id}>'