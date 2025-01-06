from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from config.database import db
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = Column(Integer, primary_key=True)
    card_id = Column(Integer, ForeignKey('cards.id'), nullable=False)
    amount = Column(Float, nullable=False)
    transaction_type = Column(String(20), nullable=False)  # Ej. 'Credit', 'Debit'
    transaction_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    description = Column(String(255))
    user_id = Column(Integer, ForeignKey('users.id'))

    def __repr__(self):
        return f'<Transaction {self.id}>'