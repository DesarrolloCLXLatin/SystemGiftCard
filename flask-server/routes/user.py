# Ejemplo de cómo definir una ruta en Express (Node.js)
from flask import Blueprint, request, jsonify
from models.user import User

user = Blueprint('user', __name__)

@user.route('/find_user', methods=['POST'])
def find_user():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'message': 'Username is required'}), 400

    print(f"Searching for user with username: {username}")
    user = User.query.filter_by(username=username).first()
    if user:
        print(f"User found: {user}")
        return jsonify({
            'username': user.username,
            'email': user.email,
            'photo_url': user.photo,
            'avatar_url': user.avatar
        }), 200
    print("User not found")
    return jsonify({'message': 'User not found'}), 404
