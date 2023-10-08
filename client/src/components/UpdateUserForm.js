import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function UpdateUserForm({ match }) {
  const { userId } = match.params;

  
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  
  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  const handleUpdateUser = async (values) => {
    try {
      const response = await fetch(`/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.status === 200) {
        console.log('User updated:', values);
      } else {
        throw new Error(`Update failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Update error:', error.message);
    }
  };

  
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleUpdateUser,
  });

  return (
    <div>
      <h2>Update User</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            placeholder="New Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="error">{formik.errors.username}</div>
          ) : null}
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="New Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error">{formik.errors.password}</div>
          ) : null}
        </div>
        <button type="submit">Update User</button>
      </form>
    </div>
  );
}

export default UpdateUserForm;

//to update a user you have to add the update-user to the end of localhost:3000 + a integer
//example localhost:3000/update-user/1