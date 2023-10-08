

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function LoginForm() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = () => {
   
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 200) {
          history.push('/dashboard'); 
        } else {
          
          response.json().then((data) => setError(data.error));
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <div>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default LoginForm;
