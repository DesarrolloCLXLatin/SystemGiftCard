from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from config.database import db
from datetime import datetime

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    action = Column(String(255), nullable=False)
    details = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<AuditLog {self.action}>'