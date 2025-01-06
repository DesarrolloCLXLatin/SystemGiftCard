from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from config.database import db
from datetime import datetime

class Card(db.Model):  # Asegúrate de heredar de db.Model
    __tablename__ = 'cards'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    activated_by = Column(Integer, ForeignKey('users.id'))
    deactivated_by = Column(Integer, ForeignKey('users.id'))
    card_number = Column(String(50), unique=True, nullable=False)
    balance = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    batch_id = Column(Integer, ForeignKey('gift_card_batches.id'))  # Agregar esta línea

    user = relationship('User', back_populates='cards', foreign_keys=[user_id])
    activated_by_user = relationship('User', back_populates='activated_cards', foreign_keys=[activated_by])
    deactivated_by_user = relationship('User', back_populates='deactivated_cards', foreign_keys=[deactivated_by])
    batch = relationship('GiftCardBatch', back_populates='cards')  # Agregar esta línea

    def __repr__(self):
        return f'<Card {self.card_number}>'