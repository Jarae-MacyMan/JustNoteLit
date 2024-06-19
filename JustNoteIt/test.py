from flask_bcrypt import Bcrypt

app = Flask(__name__)
bcrypt = Bcrypt(app)

print("Flask-Bcrypt imported successfully")