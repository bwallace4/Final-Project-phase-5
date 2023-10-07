from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db


# Models go here!

class User(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')
       

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))
   
    def __repr__(self):
        return f'<User {self.username}>'
    
    @validates("username")
    def validate_username(self, key, username):
        # Check if username meets your validation criteria (e.g., length)
        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters long.")
        return username

    @validates("email")
    def validate_email(self, key, email):
        # Check if email meets your validation criteria (e.g., format)
        if not email or "@" not in email:
            raise ValueError("Invalid email address.")
        return email
    
class Employee(db.Model,SerializerMixin):
     id = db.Column(db.Integer, primary_key=True)
     name = db.Column(db.String(100), nullable=False)
     level = db.Column(db.Integer, nullable=False)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.Date, nullable=True)
    completed = db.Column(db.Boolean, default=False)
    # Define relationships if any, for example, a task belongs to a user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('tasks', lazy=True))


class Manager(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    department = db.Column(db.String(50))
    title = db.Column(db.String(50))         