import React, { useState, useEffect } from "react";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
  }, []);

  return (
    <div>
      <h2>Employee List</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              <strong>{employee.name}</strong> - {employee.level}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EmployeeList;
