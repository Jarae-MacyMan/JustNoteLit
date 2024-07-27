import os
import functools

from flask import Flask, render_template, redirect, request, session, url_for, flash, g, jsonify
#creates migration script to edit db
from flask_session import Session
from flask_bcrypt import Bcrypt
#encrypts the password
from config import app, db
from models import User, Note



app.config.from_mapping(
    SECRET_KEY=os.environ.get('SECRET_KEY', default='dev')
)

bcrypt = Bcrypt(app)
server_session = Session(app)



@app.route("/@me")
def get_current_user():
    #check if user is logged in
    user_id = session.get("user_id")#get userid from session

    user = User.query.filter_by(id=user_id).first() #search thru db by userid 
    return jsonify({"id":user.id, "username":user.username, "message":"you are logged in", "auth":True})

@app.route('/')
def index():
    return "index"


def require_login(view): #can only make certain req is logged in
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if not g.user:
                return "no"
        return view(**kwargs)
    return wrapped_view

@app.before_request
def load_user():
    user_id = session.get('user_id')
    if user_id:
        g.user = User.query.get(user_id)
    else:
        g.user = None

@app.route('/signup', methods=["POST"])
def sign_up():
    if request.method == 'POST': #check method on req
        username = request.json["username"]
        password = request.json["password"]
        error = None

        #if user doesnt provide username passwd or unique name then error
        if not username:
            error = 'Username is required'
        elif not password:
            error = 'Password is required'
        elif User.query.filter_by(username=username).first(): #searches thru db to see if username exists
            error = 'Username exists'


        try:
            new_user = User(username=username, password=bcrypt.generate_password_hash(password))
            #get session from db to edit it
            db.session.add(new_user) #creates user
            db.session.commit() #inserts user into db

            session['user_id'] = new_user.id

        except:
            return jsonify({"error": error}), 409
        
        return jsonify({"id":new_user.id,"username":new_user.username, "message":"sign up success!"})
    
    



@app.route('/login', methods=["POST"])
def log_in():
    if request.method == 'POST': #check method on req
        username = request.json["username"]
        password = request.json["password"]
        error = None

        user = User.query.filter_by(username=username).first() #searches for user by username

        #if user doesnt exist
        if user is None:
            error = "Username or password are incorrect"
            return jsonify({"error": error}), 401

        #if passoword for user doesnt exist
        if not bcrypt.check_password_hash(user.password, password):
            error = "Username or password are incorrect"
            return jsonify({"error": error }), 401
        
        
        try:
            session.clear() #reset the session by clearing it before login
            session['user_id'] = user.id #assignes the user an id
            session['username'] = user.username #assign username 

        except Exception as error:
            return jsonify({"error": error}), 401
        
        return jsonify({"id":user.id, "username":user.username, "message":"log in success!"})



@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id") #remove user from session
    return "200"




        




@app.route('/notes') #reads notes on home page
@require_login
def get_notes():

    user_id = session.get("user_id") #get user id from session
    note = Note.query.filter_by(user_id=user_id) #new note

    json_notes = list(map(lambda x: x.to_json(), note)) #list the notes
    return jsonify({"notes": json_notes})  #get all notes from the user with this id

@app.route('/notes/new', methods=['GET', 'POST'])
@require_login
def create_notes():
    title = request.json.get("title")
    body = request.json.get("body")
    #gets the notes title and body input
    error = None

    if not title or not body:
        #if not title or body then return err
        error = 'You must include the title and body of your note'
        return jsonify({"error": error}),400

    note = Note(author=g.user, title=title, body=body) #create new note

    try:
        
        db.session.add(note) #add note to session
        db.session.commit() #session commits note to db
    except:
        return jsonify({"error": error}), 400
        
    return jsonify({"title":note.title, "body":note.body, "message":"Note Added!"})
    

@app.route('/note/edit/<int:note_id>', methods=('POST', 'PATCH', 'PUT')) #takes in note is
def note_update(note_id):
    user_id = session.get("user_id") #get the user from session
    note = Note.query.filter_by(user_id=user_id, id=note_id).first_or_404() #filter to get note from userid and note id
    error = None
    
    
    if request.method in ['PUT', 'PATCH']:
        title = request.json.get("title")
        body = request.json.get("body")

        if not title or not body:
        #if not title or body then return err
            error = 'You must include the title and body of your note'
            return jsonify({"error": error}),400


        if not error:
            note.title = request.json.get("title", title)
            note.body = request.json.get("body", body)
            #db.session.add(note)
            db.session.commit()

    return jsonify({"title":note.title, "body":note.body, "message":"note edited"})


@app.route('/note/delete/<int:note_id>', methods=['DELETE'])
def note_delete(note_id):
    #get note id from url req
    
    user_id = session.get("user_id") #get the user from session
    note = Note.query.filter_by(user_id=user_id, id=note_id).first_or_404() #filter to get note from userid and note id

    if not note:
        return jsonify({"message":"note not found"})

    db.session.delete(note)
    db.session.commit() #delets note and commits to db session
    return jsonify({"message":f"Successfully deleted note: '{note.title}'"})


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(host='0.0.0.0', port=8000, debug=True)

