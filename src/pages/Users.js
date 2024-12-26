import React, { useState, useEffect } from "react";
import { getUsers, addUser, updateUserRole, deleteUser } from "../api"; 
import "./Users.css"; 
import Navbar from "./navbar";
import moment from "moment";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "User" });
  const [loggedInUserRole, setLoggedInUserRole] = useState("");
  const [editingRole, setEditingRole] = useState(null); 
  const [updatedRole, setUpdatedRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);

      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      if (loggedInUser) {
        const loggedInUserDetails = fetchedUsers.find(
          (user) => user.email === loggedInUser.email
        );
        if (loggedInUserDetails) {
          setLoggedInUserRole(loggedInUserDetails.role);
          localStorage.setItem("role", loggedInUserDetails.role);
        } else {
          setLoggedInUserRole("User");
        }
      }
    };

    fetchUsers();
  }, []);

  const SignedInUser = JSON.parse(localStorage.getItem("user"));

  const handleAddUser = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      newUser.createdBy = loggedInUser.email;
      await addUser(newUser);
      setUsers((prev) => [
        ...prev,
        { ...newUser, createdAt: new Date().toISOString(), createdBy: loggedInUser.email },
      ]);
      setNewUser({ name: "", email: "", role: "User" });
      setIsModalOpen(false);
    } catch (error) {
      alert("Error adding user: " + error.message);
    }
  };

  const handleRoleEdit = (userId, role) => {
    setEditingRole(userId);
    setUpdatedRole(role);
  };

  const handleRoleSave = async (userId) => {
    try {
      await updateUserRole(userId, updatedRole); 
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: updatedRole } : user
        )
      );
      setEditingRole(null);
    } catch (error) {
      alert("Error updating role: " + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this User?"
    );
    if(confirmDelete){
    try {
      await deleteUser(userId); 
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      alert("Error deleting user: " + error.message);
    }
  }
  };

  const canAddUser = loggedInUserRole === "Admin" || loggedInUserRole === "Manager";

  const roleOptions =
    loggedInUserRole === "Admin"
      ? ["Admin", "Manager", "User"]
      : loggedInUserRole === "Manager"
      ? ["User"]
      : [];
  return (
    <div className="app-container">
      <Navbar currentUserEmail={SignedInUser.email} userRole={loggedInUserRole} userName={SignedInUser.name} />
      <div className="users-container">
        <h1 className="users-title">Users</h1>

        {canAddUser && (
          <button className="add-user-button" onClick={() => setIsModalOpen(true)}>
            Add User
          </button>
        )}

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Created By</th>
              <th>Role</th>
              {loggedInUserRole === "Admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-name">
                    {user.name}
                   {loggedInUserRole === "Admin" && (SignedInUser.email !=user.email) && <span
                      className="delete-icon"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      ❌
                    </span>
                    }
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt._seconds * 1000).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(",", "")}</td>
                <td>{user.createdBy}</td>
                <td>
                  {editingRole === user.id ? (
                    <select
                      value={updatedRole}
                      onChange={(e) => setUpdatedRole(e.target.value)}
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                {loggedInUserRole === "Admin" && (
                  <td>
                    {editingRole === user.id ? (
                      <>
                        <button onClick={() => handleRoleSave(user.id)}>Save</button>
                        <button onClick={() => setEditingRole(null)}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => handleRoleEdit(user.id, user.role) } disabled={(SignedInUser.email == user.email)}>
                        Edit
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add User</h2>
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <button onClick={handleAddUser}>Submit</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
