from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from config.database import db
from datetime import datetime

# Tabla de asociación many-to-many entre roles y permisos
roles_permissions = Table('roles_permissions', db.metadata,
    Column('role_id', Integer, ForeignKey('roles.id'), primary_key=True),
    Column('permission_id', Integer, ForeignKey('permissions.id'), primary_key=True)
)

class Role(db.Model):
    __tablename__ = 'roles'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relación many-to-many con permisos
    permissions = relationship('Permission', secondary=roles_permissions, back_populates='roles')

    def __repr__(self):
        return f'<Role {self.name}>'