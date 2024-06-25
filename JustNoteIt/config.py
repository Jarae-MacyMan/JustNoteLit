from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import redis
from os import environ

app = Flask(__name__) #creates flask instance
CORS(app, supports_credentials=True)

app.config["SQLALCHEMY_DATABASE_URI"] = r"sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True

app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_REDIS"] = redis.from_url("redis://127.0.0.1:6379")






db = SQLAlchemy(app)