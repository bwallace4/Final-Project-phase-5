import React, { useState, useEffect } from "react";
import "./UserList.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
       
        data.sort((a, b) => a.id - b.id);
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getUsers(); 

  }, []); 

  const handleDeleteUser = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this user?")) {
        const response = await fetch(`/users/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='user-list-container'>
      <h2>User List</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className='user-table'>
          <thead>
            <tr>
              <th>Number</th>
              <th>Username</th>
              <th>Email</th> 
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td> 
                <td>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserList;
