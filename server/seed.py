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
        for _ in range(10):  
            username = fake.user_name()
            email = fake.email()
            password = fake.password(length=10) 

           
            new_user = User(username=username, email=email)
            new_user.password_hash = password  
           
            db.session.add(new_user)

       
        db.session.commit()

        print("Seed completed successfully!")



