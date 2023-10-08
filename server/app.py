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

        
        required_fields = ["username", "email", "password"]
        if not all(field in data for field in required_fields):
            return (
                json.dumps({"error": "Missing required fields"}),
                400,
            )

        
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
           
            new_user = User(username=data["username"], email=data["email"])

         
            new_user.password_hash = data["password"]

            
            db.session.add(new_user)
            db.session.commit()

         
           

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

       
        new_username = data.get("username")
        existing_user_with_username = User.query.filter(User.username == new_username).first()

        if existing_user_with_username and existing_user_with_username.id != user_id:
            return json.dumps({"error": "Username is already taken"}), 400

        for attr in data:
            setattr(user, attr, data[attr])

        db.session.commit()

        response_data = user.to_dict()

        return json.dumps(response_data), 200


@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()

    if not users:
        return jsonify({"message": "No users found"}), 404

    return jsonify([user.to_dict() for user in users]), 200


@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200


@app.route('/employees', methods=['POST', 'GET'])
def handle_employees():
    if request.method == 'POST':
        data = request.json

      
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
    elif request.method == 'GET':
        try:
            employees = Employee.query.all()
            employee_list = [employee.to_dict() for employee in employees]
            return jsonify(employee_list), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/employees/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    try:
        employee = Employee.query.get(employee_id)
        if not employee:
            return jsonify({'error': 'Employee not found'}), 404

        db.session.delete(employee)
        db.session.commit()

        return jsonify({'message': 'Employee deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/managers', methods=['POST', 'GET'])
def handle_managers():
    if request.method == 'POST':
        data = request.json
        manager = Manager(**data)
        db.session.add(manager)
        db.session.commit()
        return jsonify(manager.to_dict()), 201
    elif request.method == 'GET':
        try:
            managers = Manager.query.all()
            manager_list = [manager.to_dict() for manager in managers]
            return jsonify(manager_list), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/managers/<int:manager_id>', methods=['DELETE'])
def delete_manager(manager_id):
    try:
        manager = Manager.query.get(manager_id)
        if not manager:
            return jsonify({'error': 'Manager not found'}), 404

        db.session.delete(manager)
        db.session.commit()

        return jsonify({'message': 'Manager deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tasks', methods=['POST', 'GET'])
def handle_tasks():
    if request.method == 'POST':
        data = request.json
        title = data.get('title')
        description = data.get('description')

    
        task = Task(title=title, description=description)

        db.session.add(task)
        db.session.commit()

        return jsonify(task.to_dict()), 201
    elif request.method == 'GET':
        try:
            tasks = Task.query.all()
            task_list = [task.to_dict() for task in tasks]
            return jsonify(task_list), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500


@app.route('/tasks/<int:taskId>', methods=['DELETE'])
def delete_task(taskId):
    try:
        task = Task.query.get(taskId)
        if not task:
            return jsonify({'error': 'Task not found'}), 404

        db.session.delete(task)
        db.session.commit()

        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
   app.run(port=5555, debug=True)


