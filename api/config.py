from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from flask_cors import CORS
import os

app = Flask(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///vehicles.db")
