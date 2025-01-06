from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from config.database import db
from datetime import datetime

class Store(db.Model):  # Asegúrate de heredar de db.Model
    __tablename__ = 'stores'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), index=True)
    address = Column(String(255))
    city = Column(String(50))
    state = Column(String(50))
    country = Column(String(50))
    postal_code = Column(String(20))
    phone = Column(String(20))
    email = Column(String(250))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relación one-to-many con User
    users = relationship('User', back_populates='store')

    def __repr__(self):
        return f'<Store {self.name}>'