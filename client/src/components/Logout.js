import React from 'react';


function Logout() {
  const handleLogout = () => {
    // Send a DELETE request to the /logout route
    fetch('/logout', {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 204) {
          // Logout successful, refresh the page
          window.location.reload();
        } else {
          // Handle logout error
          console.error('Logout failed');
        }
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
