from sqlalchemy import Column, Integer, Float, DateTime, String, Text, ForeignKey
from config.database import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    amount = Column(Float, nullable=False)
    order_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(String(20), default='Pending')
    items = Column(Text)  # Detalles de los artículos en el pedido

    def __repr__(self):
        return f'<Order {self.id}>'