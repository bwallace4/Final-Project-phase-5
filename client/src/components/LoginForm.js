import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginForm = () => {
  const history = useHistory();

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
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
            setErrors({ username: data.error });
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
        onSubmit={handleSubmit}
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
              <ErrorMessage
                name="username"
                component="div"
                className="error-message"
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <Field
                type="password"
                name="password"
                id="password"
                placeholder="Password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
            </div>
            <div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging In...' : 'Login'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
