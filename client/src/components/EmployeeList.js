import React, { useState, useEffect } from "react";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeLevel, setNewEmployeeLevel] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/employees");
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

  
    fetchEmployees();

    // Refresh employee data every 2 seconds
    const intervalId = setInterval(() => {
      fetchEmployees();
    }, 4000);

   
    return () => clearInterval(intervalId);
  }, []);

  const handleNameChange = (e) => {
    setNewEmployeeName(e.target.value);
  };

  const handleLevelChange = (e) => {
    setNewEmployeeLevel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newEmployeeName,
          level: parseInt(newEmployeeLevel),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add a new employee");
      }

      const data = await response.json();
      setEmployees([...employees, data]);

      setNewEmployeeName("");
      setNewEmployeeLevel("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch(`/employees/${employeeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the employee");
      }

      const updatedEmployees = employees.filter((employee) => employee.id !== employeeId);
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Employee List</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Employee Name"
          value={newEmployeeName}
          onChange={handleNameChange}
        />
        <input
          type="number"
          placeholder="Employee Level"
          value={newEmployeeLevel}
          onChange={handleLevelChange}
        />
        <button type="submit">Add Employee</button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              <strong>{employee.name}</strong> - {employee.level}
              <button onClick={() => handleDelete(employee.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EmployeeList;
