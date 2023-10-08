import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './RegisterForm.css';

function RegisterForm() {
  
  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  
  const handleSubmit = (values, { setSubmitting }) => {
   
    setTimeout(() => {
      console.log('Form values submitted:', values);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="register-form-container">
      <h2>Sign Up</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="username">Username</label>
              <Field
                type="text"
                id="username"
                name="username"
                placeholder="Username"
              />
              <ErrorMessage name="username" component="p" className="error-message" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Email"
              />
              <ErrorMessage name="email" component="p" className="error-message" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                id="password"
                name="password"
                placeholder="Password"
              />
              <ErrorMessage name="password" component="p" className="error-message" />
            </div>
            <div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Register'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default RegisterForm;
