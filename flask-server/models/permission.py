from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from config.database import db
from datetime import datetime

class Permission(db.Model):
    __tablename__ = 'permissions'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), index=True)
    permission_type = Column(String(50))  # e.g., 'generate_cards', 'activate_card', etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = Column(Integer, ForeignKey('users.id'))

    user_permission = relationship('User', back_populates='permissions')
    roles = relationship('Role', secondary='roles_permissions', back_populates='permissions')

    def __repr__(self):
        return f'<Permission {self.permission_type} for user {self.user_id}>'