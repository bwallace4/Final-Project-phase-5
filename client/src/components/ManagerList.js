import React, { useState, useEffect } from "react";

function ManagerList() {
  const [managers, setManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    department: "", 
    title: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/managers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create manager");
      }

   
      setFormData({
        name: "",
        email: "",
        department: "",
        title: "",
      });

     
      fetchManagers();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchManagers = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/managers");
      if (!response.ok) {
        throw new Error("Failed to fetch managers");
      }
      const data = await response.json();
      setManagers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  return (
    <div>
      <h2>Manager List</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email" // Use "email" input type for email field
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Manager</button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
             {managers.map((manager) => (
      <li key={manager.id}>
        <strong>Name:</strong> {manager.name} <br />
        <strong>Email:</strong> {manager.email} <br />
        <strong>Department:</strong> {manager.department} <br />
        <strong>Title:</strong> {manager.title}
      </li>
    ))}
  </ul>
)}     
    </div>
  );
}

export default ManagerList;
