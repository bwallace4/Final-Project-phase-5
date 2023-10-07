import React, { useState, useEffect } from 'react';

function CheckSession() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Send a GET request to your Flask CheckSession route
    fetch('/check-session')
      .then((response) => {
        if (response.status === 200) {
          // User is authenticated, fetch user data
          return response.json();
        } else {
          // User is not authenticated
          return null;
        }
      })
      .then((data) => {
        // Set the user data in state
        setUser(data);
      })
      .catch((error) => {
        console.error('CheckSession error:', error);
      });
  }, []);

  return (
    <div>
      {user ? (
        <p>Welcome, {user.username}!</p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

export default CheckSession;
