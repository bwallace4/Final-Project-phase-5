import React, { useState } from 'react';

function UpdateUserForm({ match }) {
  const { userId } = match.params; // Extract userId from match.params

  const [userData, setUserData] = useState({
    // Initialize with the user's data
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null); // State to store error message

  const handleUpdateUser = () => {
    // Send a PATCH request to update user data
    fetch(`/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), // Include the updated user data
    })
      .then((response) => {
        console.log('Response status:', response.status); // Log the response status
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(`Update failed with status ${response.status}`);
        }
      })
      .then((data) => {
        // Handle the updated user data (e.g., display a success message)
        console.log('User updated:', data); // Log the updated user data
        setError(null); // Clear any previous error
      })
      .catch((error) => {
        // Handle errors (e.g., display an error message)
        console.error('Update error:', error); // Log the error
        setError(error.message); // Set the error message
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  console.log('userData:', userData); // Log the current userData

  return (
    <div>
      {/* Input fields for updating user data */}
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
      
      {/* Display error message if there's an error */}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default UpdateUserForm;
