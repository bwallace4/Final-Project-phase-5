import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './RegisterForm.css';

function RegisterForm() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({}); // Store validation errors
  const [registrationStatus, setRegistrationStatus] = useState(''); // Store registration status message
  const [serverResponseData, setServerResponseData] = useState(null); // Store server response data

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegistration = () => {
    // Send a POST request to /register with formData
    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Data received from server:', data);
        // Store the server response data
        setServerResponseData(data);

        if (data.error) {
          // Handle validation errors received from the server
          setErrors(data);
          setRegistrationStatus('Registration failed. Please fix the errors.');
        } else {
          // Clear any previous errors
          setErrors({});
          // Check if registration was successful
          if (data.message === 'User registered successfully') {
            setRegistrationStatus('Registration successful. Redirecting...');
            // Redirect the user to another page upon successful registration
            setTimeout(() => {
              history.push('/success-page');
            }, 2000); // Redirect after 2 seconds
          }
        }
      })
      .catch((error) => {
        // Handle any network or request errors
        console.error(error);
        // Optionally, you can set an error state here to inform the user
      });
  };

  return (
    <div className="register-form-container">
      <h2>Register</h2>
      {registrationStatus && <p className="registration-status">{registrationStatus}</p>}
      <div>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
        />
        {errors.username && <p className="error-message">Error: {errors.username}</p>}
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <p className="error-message">Error: {errors.email}</p>}
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        {errors.password && <p className="error-message">Error: {errors.password}</p>}
      </div>
      <div>
        <button onClick={handleRegistration}>Register</button>
      </div>
      {serverResponseData && (
        <div className="server-response">
          <p>Data received from server: {JSON.stringify(serverResponseData)}</p>
        </div>
      )}
    </div>
  );
}

export default RegisterForm;
