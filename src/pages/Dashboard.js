import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Navbar from "./navbar";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));

  return (

    <div className="dashboard-container">
        <Navbar currentUserEmail={user.email} userRole={user.role} userName={user.name} />

      <h1 className="dashboard-title">Dashboard</h1>

      {/*<nav className="dashboard-nav">
        <Link to="/tasks" className="dashboard-link">
          Tasks
        </Link>
        <Link to="/users" className="dashboard-link">
          Users
        </Link>
      </nav>
      */}
    </div>
  );
};

export default Dashboard;
