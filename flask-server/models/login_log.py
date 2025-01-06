from sqlalchemy import Column, Integer, DateTime, String, ForeignKey
from config.database import db
from datetime import datetime

class LoginLog(db.Model):
    __tablename__ = 'login_logs'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    login_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    logout_time = Column(DateTime)
    ip_address = Column(String(45))

    def __repr__(self):
        return f'<LoginLog {self.user_id}>'