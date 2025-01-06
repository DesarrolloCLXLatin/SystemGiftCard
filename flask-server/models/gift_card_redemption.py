from sqlalchemy import Column, Integer, Float, DateTime, String, ForeignKey
from config.database import db
from datetime import datetime

class GiftCardRedemption(db.Model):
    __tablename__ = 'gift_card_redemptions'
    id = Column(Integer, primary_key=True)
    card_id = Column(Integer, ForeignKey('cards.id'), nullable=False)
    amount_redeemed = Column(Float, nullable=False)
    redemption_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    redeemed_by = Column(String(50), ForeignKey('users.username'))

    def __repr__(self):
        return f'<GiftCardRedemption {self.id}>'