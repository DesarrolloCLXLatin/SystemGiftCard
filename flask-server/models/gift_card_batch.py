from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from config.database import db
from datetime import datetime

class GiftCardBatch(db.Model):
    __tablename__ = 'gift_card_batches'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relación one-to-many con Card
    cards = relationship('Card', back_populates='batch')

    def __repr__(self):
        return f'<GiftCardBatch {self.name}>'