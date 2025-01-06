# config.py
import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'mysql://root:@localhost:3306/giftcard_system')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
