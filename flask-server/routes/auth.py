# routes/auth.py
from flask import Blueprint, request, jsonify
from models.user import User
from config.database import db
from config.security import hash_password, verify_password
from utils.jwt_utils import generate_token, decode_token
from werkzeug.security import generate_password_hash
from utils.mail import send_reset_email
from datetime import datetime, timedelta

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Received data:", data)

    required_fields = ['firstname', 'lastname', 'phone', 'username', 'email', 'password', 'store']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400

    hashed_password = hash_password(data['password'])
    token = generate_token(data['username'])
    token_expiration = datetime.utcnow() + timedelta(days=1)

    new_user = User(
        firstname=data['firstname'],
        lastname=data['lastname'],
        phone=data['phone'],
        username=data['username'],
        email=data['email'],
        password=hashed_password,
        token=token,
        token_expiration=token_expiration,
        role='user',
        status='active',
        previus_password='',
        photo=data.get('photo', 'NULL'),
        avatar=data.get('avatar', 'default.jpg'),
        store_id=data['store']
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print("Received data:", data)
    user = User.query.filter_by(username=data['username']).first()
    if user and verify_password(user.password, data['password']):
        user.last_login = datetime.utcnow()
        db.session.commit()
        token = generate_token(user.id)
        return jsonify({'token': token, 'role': user.role}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@auth.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    token = user.generate_reset_token()
    reset_link = f"http://localhost:3000/reset-password/{token}"
    send_reset_email(user.email, reset_link)

    return jsonify({'message': 'Password reset email sent'}), 200

@auth.route('/reset_password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    new_password = data.get('newPassword')

    if not new_password:
        return jsonify({'error': 'New password is required'}), 400

    user = User.verify_reset_token(token)
    if not user:
        return jsonify({'error': 'Invalid or expired token'}), 400

    user.set_password(new_password)
    user.previus_password = user.password
    db.session.commit()

    return jsonify({'message': 'Password has been reset successfully'}), 200

@auth.route('/check_username', methods=['POST'])
def check_username():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'error': 'Username is required'}), 400

    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({'exists': True}), 200
    else:
        return jsonify({'exists': False}), 200

@auth.route('/current_user', methods=['GET'])
def current_user():
    auth_header = request.headers.get('Authorization')
    if auth_header:
        token = auth_header.split(' ')[1]
        user_id = decode_token(token)
        user = User.query.get(user_id)
        if user:
            return jsonify({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'photo': user.photo,
                'avatar': user.avatar
            }), 200
    return jsonify({'message': 'User not found'}), 404