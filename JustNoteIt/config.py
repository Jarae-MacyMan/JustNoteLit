import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import redis
from dotenv import load_dotenv
from os import environ

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__) #creates flask instance
CORS(app, supports_credentials=True)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS", default=False)
app.config["SQLALCHEMY_ECHO"] = os.getenv("SQLALCHEMY_ECHO", default=False)

# Redis configuration
redis_host = os.getenv("REDIS_HOST", "127.0.0.1")
redis_port = os.getenv("REDIS_PORT", 6379)
app.config["SESSION_REDIS"] = redis.from_url(f"redis://{redis_host}:{redis_port}")

app.config["SESSION_TYPE"] = os.getenv("SESSION_TYPE", "redis")
app.config["SESSION_PERMANENT"] = os.getenv("SESSION_PERMANENT", False)
app.config["SESSION_USE_SIGNER"] = os.getenv("SESSION_USE_SIGNER", True)


# app.config["SESSION_REDIS"] = redis.from_url("redis://127.0.0.1:6379")






db = SQLAlchemy(app)