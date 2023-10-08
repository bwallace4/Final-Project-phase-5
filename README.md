# B.Y.O.B - Be Your Own Boss

My app allows users to put themselves in the shoes of a manager and a employer. Creating tasks and inputting your own data. 

## Table of Contents
  - [Description](#description)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [Acknowledgments](#acknowledgments)

## Description
I had to create a phase 5 final project for The Flatiron school.
First I used a Flask/SQLAlchemy API backend with a React frontend, But I had to create my own API. Creating models and using crud actions that included create,read, update and delete. I also included different client-side routes using React Router. I protected passwords for all of my users when I implemented password hashing and authentication. When registering and logging in I used validations to set standards on my input fields. Then i connected the backend to the frontend using fetch(). 


## Getting Started

Fork & clone https://github.com/bwallace4/Final-Project-phase-5.git repository 
cd into Final-Project-phase-5 
cd intto server 
run the main directory with python app.py
You should see this message 
 * Serving Flask app 'config'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5555
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 111-864-616

Next we want to run the client side with  npm start --prefix client
we should see this in the terminal 
Compiled successfully!

You can now view client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.160:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully

### Prerequisites

Make sure to have these packages installed

flask, flask-sqlalchemy, flask-migrate, sqlalchemy-serlizer, flask-cors, 
formik,react, react-router-dom, Bcrypt,flask_restful

### Installation

we wanna run pipenv install & shell to download the dependencies 
We want to run flask db init, flask db upgrade head for our migrations 

## Contributing
Others can contribute by suggesting ways to improve my code


## Acknowledgments

I like to credit The Flatiron School
