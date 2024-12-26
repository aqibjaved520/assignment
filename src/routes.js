import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import ChangePassword from "./pages/ChangePasswordPage";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/tasks/:taskId" element={<TaskDetails />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Routes>
  </Router>
);

export default AppRoutes;