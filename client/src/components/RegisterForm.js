import React, { useState } from 'react';
import './RegisterForm.css';

function RegisterForm() {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({}); 
  const [registrationStatus, setRegistrationStatus] = useState(''); 
  const [serverResponseData, setServerResponseData] = useState(null); 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegistration = () => {
  
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
     
        setServerResponseData(data);

        if (data.error) {
          
          setErrors(data);
          setRegistrationStatus('Registration failed. Please fix the errors.');
        } else {
         
          setErrors({});
       
          if (data.message === 'User registered successfully') {
            setRegistrationStatus('Registration successful. Redirecting...');
            
            
          }
        }
      })
      .catch((error) => {
        
        console.error(error);
        
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
