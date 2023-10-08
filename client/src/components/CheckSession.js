import React, { useState, useEffect } from "react";

function CheckSession() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/check-session")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          return null;
        }
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("CheckSession error:", error);
      });
  }, []);

  return (
    <div>
      {user ? <p>Welcome, {user.username}!</p> : <p>You are not logged in.</p>}
    </div>
  );
}

export default CheckSession;
