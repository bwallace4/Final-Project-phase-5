import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

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

    const intervalId = setInterval(() => {
      fetchEmployees();
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch(`/employees/${employeeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the employee");
      }

      const updatedEmployees = employees.filter(
        (employee) => employee.id !== employeeId
      );
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error(error);
    }
  };

  // Define the validation schema using Yup
  const validationSchema = Yup.object().shape({
    newEmployeeName: Yup.string().required("Employee Name is required"),
    newEmployeeLevel: Yup.number()
      .integer("Level must be an integer")
      .required("Employee Level is required"),
  });

 
  const formik = useFormik({
    initialValues: {
      newEmployeeName: "",
      newEmployeeLevel: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch("/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.newEmployeeName,
            level: parseInt(values.newEmployeeLevel),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add a new employee");
        }

        const data = await response.json();
        setEmployees([...employees, data]);

       
        formik.resetForm();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div>
      <h2>Employee List</h2>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="Employee Name"
          name="newEmployeeName"
          value={formik.values.newEmployeeName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.newEmployeeName && formik.errors.newEmployeeName ? (
          <div>{formik.errors.newEmployeeName}</div>
        ) : null}
        <input
          type="number"
          placeholder="Employee Level"
          name="newEmployeeLevel"
          value={formik.values.newEmployeeLevel}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.newEmployeeLevel && formik.errors.newEmployeeLevel ? (
          <div>{formik.errors.newEmployeeLevel}</div>
        ) : null}
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
