import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function LoginForm() {
  const history = useHistory();

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const onSubmit = (values, { setSubmitting }) => {
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        setSubmitting(false);
        if (response.status === 200) {
          history.push('/dashboard');
        } else {
          response.json().then((data) => {
            // Handle login error, you can set an error state here
            console.error('Login error:', data.error);
          });
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        setSubmitting(false);
      });
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="username">Username:</label>
              <Field
                type="text"
                name="username"
                id="username"
                placeholder="Username"
              />
              <ErrorMessage name="username" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <Field
                type="password"
                name="password"
                id="password"
                placeholder="Password"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <div>
              <button type="submit" disabled={isSubmitting}>
                Login
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default LoginForm;
