from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from config.database import db
from datetime import datetime

class QRCode(db.Model):
    __tablename__ = 'qrcodes'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    qr_code = Column(String(350))
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)

    user_qr = relationship('User', back_populates='qr_codes')  # Changed backref name to avoid conflict

    def __repr__(self):
        return f'<QRCode {self.qr_code}>'