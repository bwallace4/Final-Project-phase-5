import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      newTaskTitle: "",
      newTaskDescription: "",
    },
    validationSchema: Yup.object({
      newTaskTitle: Yup.string().required("Task Title is required"),
      newTaskDescription: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: values.newTaskTitle,
            description: values.newTaskDescription,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add a new task");
        }

        const data = await response.json();
        setTasks([...tasks, data]);

        formik.resetForm();
      } catch (error) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the task");
      }

      
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Task List</h2>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="newTaskTitle"
          placeholder="Task Title"
          value={formik.values.newTaskTitle}
          onChange={formik.handleChange}
        />
        {formik.touched.newTaskTitle && formik.errors.newTaskTitle ? (
          <div className="error">{formik.errors.newTaskTitle}</div>
        ) : null}
        <input
          type="text"
          name="newTaskDescription"
          placeholder="Task Description"
          value={formik.values.newTaskDescription}
          onChange={formik.handleChange}
        />
        <button type="submit">Add Task</button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> - {task.description}
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
