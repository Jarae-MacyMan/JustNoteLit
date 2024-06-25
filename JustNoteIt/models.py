from config import db

#create user class
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, server_default=db.func.now()) #inserts the current time
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    #when user is updated changes to current time
    notes = db.relationship('Note', backref='author', lazy=True)
    #references the notes class, notes class will backreference to user with the attribute author

    def to_json(self):
        return{
            "id": self.id,
            "userName": self.username,
            "password": self.password,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
            "notes": self.notes
        }

#note class
class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    body = db.Column(db.Text) #text instead of string so it can be longer
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(),server_onupdate=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    #references user class with the foreignKey


    @property #create a method that doesnt have to be called
    def body_html(self):
        return markdown(self.body)
    
    def to_json(self):
        return{
            "note_id": self.id,
            "title": self.title,
            "body": self.body,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
            "user_id": self.user_id
        }
