import React from 'react';


function Logout() {
  const handleLogout = () => {
    
    fetch('/logout', {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 204) {
          
          window.location.reload();
        } else {
          
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
