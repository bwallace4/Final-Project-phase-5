import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function ManagerList() {
  const [managers, setManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      department: "",
      title: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      department: Yup.string(),
      title: Yup.string().required("Title is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("/managers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Failed to create manager");
        }

        formik.resetForm();
        fetchManagers();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleDelete = async (managerId) => {
    try {
      const response = await fetch(`/managers/${managerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the manager");
      }

      const updatedManagers = managers.filter(
        (manager) => manager.id !== managerId
      );
      setManagers(updatedManagers);
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
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="error">{formik.errors.name}</div>
          ) : null}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}
        </div>
        <div>
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={formik.values.department}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="error">{formik.errors.title}</div>
          ) : null}
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
              <button onClick={() => handleDelete(manager.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManagerList;
