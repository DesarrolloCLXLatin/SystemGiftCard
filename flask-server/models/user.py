from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from itsdangerous import TimedSerializer as Serializer  # Actualizado
from config.database import db
from flask import current_app as app
from datetime import datetime
from argon2 import PasswordHasher

ph = PasswordHasher()

class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String(50), index=True)
    lastname = Column(String(50), index=True)
    phone = Column(String(20), index=True, unique=True)
    username = Column(String(20), index=True, unique=True)
    email = Column(String(250), index=True, unique=True)
    password = Column(String(450))
    previus_password = Column(String(450))
    token = Column(String(450))
    token_expiration = Column(DateTime)
    photo = Column(String(250), nullable=True, default='NULL')
    avatar = Column(String(250), nullable=True, default='NULL')
    last_login = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = Column(String(20), default='active')
    role = Column(String(20), default='user')
    is_online = Column(Boolean, default=False)
    store_id = Column(Integer, ForeignKey('stores.id'))

    # Relationships
    store = relationship('Store', back_populates='users')
    cards = relationship('Card', back_populates='user', lazy='dynamic', foreign_keys='Card.user_id')
    activated_cards = relationship('Card', back_populates='activated_by_user', foreign_keys='Card.activated_by')
    deactivated_cards = relationship('Card', back_populates='deactivated_by_user', foreign_keys='Card.deactivated_by')
    transactions = relationship('Transaction', backref='user', lazy='dynamic')
    activity_logs = relationship('ActivityLog', backref='user_activity', lazy='dynamic')
    qr_codes = relationship('QRCode', backref='user', lazy='dynamic')
    permissions = relationship('Permission', back_populates='user_permission', lazy='dynamic')
    login_logs = relationship('LoginLog', backref='user', lazy='dynamic')

    def __repr__(self):
        return f'<User {self.firstname} {self.lastname}>'

    def set_password(self, password):
        self.password = ph.hash(password)

    def check_password(self, password):
        try:
            return ph.verify(self.password, password)
        except:
            return False

    def generate_reset_token(self, expiration=3600):
        s = Serializer(app.config['SECRET_KEY'], expiration)
        return s.dumps({'reset': self.id}).decode('utf-8')

    @staticmethod
    def verify_reset_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return None
        return User.query.get(data['reset'])