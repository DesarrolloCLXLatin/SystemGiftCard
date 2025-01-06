# app.py
from flask import Flask
from flask_cors import CORS
from config.config import Config
from config.database import db
from routes.auth import auth
from routes.user import user
from routes.store import store
from dotenv import load_dotenv
from flask_migrate import Migrate

load_dotenv()

app = Flask(__name__)
CORS(app) # Habilitar CORS para todas las rutas API
app.config.from_object(Config)

# Initialize the SQLAlchemy instance with the Flask app
db.init_app(app)

# Setup Flask-Migrate
migrate = Migrate(app, db)

with app.app_context():
    # Crear todas las tablas
    db.create_all()

    # Registrar los blueprints
    app.register_blueprint(auth, url_prefix='/api/auth')
    app.register_blueprint(user, url_prefix='/api/user')
    app.register_blueprint(store, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, port=5000)