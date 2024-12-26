import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../firebase"; 
import { updateUserRole } from "../api";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("No user is logged in.");
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);
      alert("Password updated successfully!");
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      updateUserRole(loggedInUser.id,{'mustChangePassword':false})

      navigate("/dashboard"); 
    } catch (err) {
      console.error(err.message);
      setError("Error changing password: " + err.message);
    }
  };

  return (
    <div className="change-password-container">
      <h1>Change Password</h1>
      <form onSubmit={handlePasswordChange}>
        {error && <p className="error-message">{error}</p>}
        <div>
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
