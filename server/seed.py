#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db,User
from config import app, db, api

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        for _ in range(10):  # Change the number as needed
            username = fake.user_name()
            email = fake.email()
            password = fake.password(length=10)  # Generate a random fake password

            # Create a new user instance and set the attributes
            new_user = User(username=username, email=email)
            new_user.password_hash = password  # Hash the password using your User model setter

            # Add the user to the database session
            db.session.add(new_user)

        # Commit the changes to the database (outside of the for loop)
        db.session.commit()

        print("Seed completed successfully!")



