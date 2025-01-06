import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from flask_sqlalchemy import SQLAlchemy
from config.config import Config

# Configura el logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Crear el motor de la base de datos
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)

# Crear una sesión
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

# Crear una clase base
Base = declarative_base()

# Inicializar SQLAlchemy
db = SQLAlchemy()

# Función para obtener una sesión de la base de datos
def get_db():
    session = SessionLocal()
    try:
        logger.debug("Session started")
        yield session
    finally:
        session.close()
        logger.debug("Session closed")