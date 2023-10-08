#!/usr/bin/env python3

# Standard library imports

# Remote library imports
import json
from sqlalchemy.exc import IntegrityError
from flask import jsonify, request, session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User,Employee,Task,Manager

class RegisterUserResource(Resource):
    def post(self):
        data = request.get_json()

        # Check if the required fields are present in the request data
        required_fields = ["username", "email", "password"]
        if not all(field in data for field in required_fields):
            return (
                json.dumps({"error": "Missing required fields"}),
                400,
            )

        # Check if a user with the same username or email already exists
        existing_user = User.query.filter_by(username=data["username"]).first()
        if existing_user:
            return (
                json.dumps({"error": "Username is already taken"}),
                400,
            )

        existing_email = User.query.filter_by(email=data["email"]).first()
        if existing_email:
            return (
                json.dumps({"error": "Email is already registered"}),
                400,
            )

        try:
            # Create a new User instance and set the username and email
            new_user = User(username=data["username"], email=data["email"])

            # Hash the plaintext password and set it in the User model
            new_user.password_hash = data["password"]

            # Add the new user to the database
            db.session.add(new_user)
            db.session.commit()

            # Store the user's ID in the session to authenticate them
            session['user_id'] = new_user.id

            response_data = {"message": "User registered successfully"}
            return json.dumps(response_data), 201
        except IntegrityError:
            return (
                json.dumps({"error": "Username or email is already taken"}),
                422,
            )
        except Exception as e:
            error_data = {"error": str(e)}
            return (
                json.dumps(error_data),
                500,
            )

class Login(Resource):
    def post(self):
        data = request.get_json()

        username = data.get('username')
        password = data.get('password')

        user = User.query.filter(User.username == username).first()

        if user:
            if user.authenticate(password):
                session['user_id'] = user.id
                return user.to_dict(), 200

        return {'error': '401 Unauthorized'}, 401

class CheckSession(Resource):
    def get(self):
        if session.get('user_id'):
            user = User.query.filter(User.id == session['user_id']).first()
            if user:
                return user.to_dict(), 200

        return {}, 204

class Logout(Resource):
    def delete(self):
        # Clear user's session
        session.clear()
        return {}, 204




# Add the RegisterUserResource to your API
api.add_resource(RegisterUserResource, "/register")
api.add_resource(Login, "/login")
api.add_resource(CheckSession, '/check-session')
api.add_resource(Logout, '/logout')


@app.route('/users/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return json.dumps({"error": "User not found"}), 404

    if request.method == 'PATCH':
        data = request.get_json()

        # Check if the new username already exists for another user
        new_username = data.get("username")
        existing_user_with_username = User.query.filter(User.username == new_username).first()

        if existing_user_with_username and existing_user_with_username.id != user_id:
            return json.dumps({"error": "Username is already taken"}), 400

        # Update the user's data
        for attr in data:
            setattr(user, attr, data[attr])

        db.session.commit()

        response_data = user.to_dict()

        return json.dumps(response_data), 200


# Get all users
@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()

    if not users:
        return jsonify({"message": "No users found"}), 404

    return jsonify([user.to_dict() for user in users]), 200


# Delete a user by username
@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200


@app.route('/employees', methods=['POST'])
def create_employee():
    data = request.json

    # Validate the data (e.g., check if required fields are present)
    if 'name' not in data or 'level' not in data:
        return jsonify({'error': 'Name and level are required fields'}), 400

    employee = Employee(**data)

    try:
        db.session.add(employee)
        db.session.commit()
        return jsonify({'message': 'Employee created successfully', 'employee_id': employee.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create employee', 'details': str(e)}), 500
    
@app.route('/managers', methods=['POST'])
def create_manager():
    data = request.json
    manager = Manager(**data)
    db.session.add(manager)
    db.session.commit()
    return jsonify(manager.to_dict()), 201

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    title = data.get('title')
    description = data.get('description')

    # Create the task without a user association
    task = Task(title=title, description=description)

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201






@app.route('/associate_users_employees', methods=['POST'])
def associate_users_employees():
    # Assuming you receive data in the request (e.g., as JSON)
    data = request.json

    # Extract user_id and employee_id from the request data
    user_id = data.get('user_id')
    employee_id = data.get('employee_id')

    if user_id is None or employee_id is None:
        return jsonify({'error': 'Missing user_id or employee_id'}), 400

    # Fetch the user and employee objects from the database
    user = User.query.get(user_id)
    employee = Employee.query.get(employee_id)

    if user is None or employee is None:
        return jsonify({'error': 'User or employee not found'}), 404

    # Associate the user with the employee by adding them to the association table
    user.employees.append(employee)

    # Commit changes to the database
    try:
        db.session.commit()
        return jsonify({'message': 'Association successful'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'details': str(e)}), 500

if __name__ == '__main__':
   app.run(port=5555, debug=True)


