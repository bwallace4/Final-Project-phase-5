// ManagerList.js

import React, { useState, useEffect } from "react";

function ManagerList() {
  const [managers, setManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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

    fetchManagers();
  }, []);

  return (
    <div>
      <h2>Manager List</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {managers.map((manager) => (
            <li key={manager.id}>
              <strong>{manager.name}</strong> - {manager.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManagerList;
