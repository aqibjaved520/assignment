import React, { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, getUsers,deleteTask } from "../api";
import Navbar from "./navbar";
import moment from "moment";
import "./Tasks.css";
import { FaUser } from "react-icons/fa";

const Tasks = ({ currentUserEmail }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending", 
  });
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
  
    if (confirmDelete) {
      try {
        await deleteTask(taskId); 
        setTasks(await getTasks()); 
        setEditModalOpen(false); 
        setSelectedTask(null); 
        alert("Task deleted successfully.");
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete the task. Please try again.");
      }
    }
  };
  
const handleMouseEnter = (event, log) => {
  const { clientX, clientY } = event;
  setTooltipPosition({ top: clientY, left: clientX });
  setHoveredLog(log || []);
};

const handleMouseLeave = () => {
  setHoveredLog(null);
};
  const user = JSON.parse(localStorage.getItem("user"));
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [hoveredLog, setHoveredLog] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const tasksData = await getTasks();
      const usersData = await getUsers();
      setTasks(tasksData);
      setUsers(usersData);
    };
    fetchData();
  }, []);

  const handleAddTask = async () => {
    if (
      !newTask.title ||
      !newTask.description ||
      !newTask.assignedTo ||
      !newTask.dueDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    await createTask(newTask);
    setTasks(await getTasks());
    setAddModalOpen(false);
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      dueDate: "",
      priority: "Medium",
      status: "Pending",
    });
  };

  const handleEditTask = async () => {
    if (!selectedTask) return;
    const taskChanges = [];
    const originalTask = tasks.find((task) => task.id === selectedTask.id);

    if (originalTask.priority !== selectedTask.priority) {
      taskChanges.push(`Priority changed from ${originalTask.priority} to ${selectedTask.priority}`);
    }
    if (originalTask.status !== selectedTask.status) {
      taskChanges.push(`Status changed from ${originalTask.status} to ${selectedTask.status}`);
    }
    if (originalTask.assignedTo !== selectedTask.assignedTo) {
      taskChanges.push(`AssignedTo changed from ${originalTask.assignedTo} to ${selectedTask.assignedTo}`);
    }
    if (originalTask.comments !== selectedTask.comments) {
      taskChanges.push(`Comments updated.`);
    }

    if (taskChanges.length > 0) {
      const newLogEntry = {
        changedBy: user?.email,
        changes: taskChanges,
        timestamp: new Date().toISOString(),
      };

      selectedTask.log = selectedTask.log ? [...selectedTask.log, newLogEntry] : [newLogEntry];
    }

    await updateTask(selectedTask.id, selectedTask);
    setTasks(await getTasks());
    setEditModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="app-container">
        <Navbar currentUserEmail={user.email} userRole={user.role} userName={user.name} />
    <div className="tasks-container">
      <h1>Tasks</h1>
      {(user.role === "Admin"  || user.role === "Manager") && <button onClick={() => setAddModalOpen(true)} className="add-task-btn">
        Add Task
      </button>}
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Created At</th>
            <th>Due Date</th>
            <th>Assigned To</th>
            <th>History</th>
          </tr>
        </thead>
        <tbody>
  {tasks.map((task) => (
    <tr key={task.id}>
      <td
        className="task-title"
        onClick={() => {
          setSelectedTask(task); 
          setEditModalOpen(true); 
        }}
      >
        <h4>{task.title}</h4>
      </td>
      <td className={`priority-${task.priority.toLowerCase()}`}>
        {task.priority}
      </td>
      <td>{task.status || "Pending"}</td>
      <td>{task.createdBy}</td>
      <td>{task.createdAt?new Date(task.createdAt._seconds * 1000).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(",", ""):''}</td>
      <td>{task.dueDate || ""}</td>
      <td>{task.assignedTo || ""}</td>
      <td>
  <div
    className="history-icon"
    onMouseEnter={(event) => handleMouseEnter(event, task.log)}
    onMouseLeave={handleMouseLeave}
  >
    <FaUser />
    {hoveredLog && hoveredLog.length > 0 && (
      <div
        className="history-tooltip"
        style={{
          top: tooltipPosition.top + "px",
          left: tooltipPosition.left + "px",
        }}
      >
        <h4>Log History</h4>
        {hoveredLog.map((log, index) => (
          <div key={index} className="log-entry">
            <p>
              <strong>Changed By:</strong> {log.changedBy}
            </p>
            <p>
              <strong>Changes:</strong>
            </p>
            <ul>
              {log.changes.map((change, i) => (
                <li key={i}>{change}</li>
              ))}
            </ul>
            <p>
              <strong>Timestamp:</strong>{" "}
              {moment(log.timestamp).format("YYYY-MM-DD HH:mm:ss")}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
</td>


    </tr>
  ))}
</tbody>

      </table>

      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-title">Add New Task</h2>
            <form className="modal-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Enter task title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Enter task description"
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Assigned To</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignedTo: e.target.value })
                  }
                >
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option key={user.email} value={user.email}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleAddTask}>
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditModalOpen && selectedTask && (
  <div className="modal">
    <div className="modal-content">
      <h2 className="modal-title">Edit Task</h2>
      <form className="modal-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={selectedTask.title || ""}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, title: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select
            value={selectedTask.priority}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, priority: e.target.value })
            }
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            value={selectedTask.status || "Pending"}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, status: e.target.value })
            }
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Comments</label>
          <textarea
            value={selectedTask.comments || ""}
            onChange={(e) =>
              setSelectedTask({ ...selectedTask, comments: e.target.value })
            }
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="button" onClick={handleEditTask}>
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setEditModalOpen(false)}
            className="cancel-btn"
          >
            Cancel
          </button>
          {user.role === "Admin" && (
            <button
              type="button"
              onClick={() => handleDeleteTask(selectedTask.id)}
              className="delete-btn"
              style={{ backgroundColor: "red", color: "white" }}
            >
              Delete Task
            </button>
          )}
        </div>
      </form>
    </div>
  </div>
)}

    </div>
    </div>
  );
};

export default Tasks;
