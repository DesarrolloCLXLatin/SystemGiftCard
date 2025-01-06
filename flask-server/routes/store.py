# routes/store.py

from flask import Blueprint, jsonify
from sqlalchemy.orm import Session
from config.database import SessionLocal
from models.store import Store
import logging

store = Blueprint('store', __name__)

# Configura el logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@store.route('/stores', methods=['GET'])
def get_stores():
    session = SessionLocal()
    try:
        stores = session.query(Store).all()
        store_list = [{"id": store.id, "name": store.name} for store in stores]
        return jsonify(store_list)
    except Exception as e:
        logger.error(f"Error fetching stores: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    finally:
        session.close()