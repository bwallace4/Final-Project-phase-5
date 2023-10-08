import React, { useState } from 'react';

function UpdateUserForm({ match }) {
  const { userId } = match.params;

  const [userData, setUserData] = useState({
   
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);

  const handleUpdateUser = () => {
   
    fetch(`/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), 
    })
      .then((response) => {
        console.log('Response status:', response.status); 
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(`Update failed with status ${response.status}`);
        }
      })
      .then((data) => {
        
        console.log('User updated:', data); 
        setError(null);
      })
      .catch((error) => {
       
        console.error('Update error:', error); 
        setError(error.message); 
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  console.log('userData:', userData); 

  return (
    <div>
   
      <input
        type="text"
        name="username"
        placeholder="New Username"
        value={userData.username}
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        placeholder="New Email"
        value={userData.email}
        onChange={handleInputChange}
      />
      <input
        type="password"
        name="password"
        placeholder="New Password"
        value={userData.password}
        onChange={handleInputChange}
      />
      <button onClick={handleUpdateUser}>Update User</button>
     
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default UpdateUserForm;
