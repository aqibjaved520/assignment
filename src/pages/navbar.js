import React, { useState } from "react";
import { FaBars, FaTasks, FaUsers, FaHome, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = ({ userRole, userName, currentUserEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Define menu options based on user role
  const menuOptions = [
    { name: "Dashboard", icon: <FaHome />, route: "/dashboard" },
    ...(userRole === "Admin" || userRole === "Manager"
      ? [
          { name: "Tasks", icon: <FaTasks />, route: "/tasks" },
          { name: "Users", icon: <FaUsers />, route: "/users" },
        ]
      : [{ name: "Tasks", icon: <FaTasks />, route: "/tasks" }]),
  ];

  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    navigate("/"); 
  };

  return (
    <div className={`navbar ${isOpen ? "open" : ""}`}>
      
      <div className="navbar-toggle">
        <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
          <FaBars />
        </button>
      </div>

      <ul className="navbar-menu">
        {menuOptions.map((option, index) => (
          <li
            key={index}
            className="navbar-item"
            onClick={() => navigate(option.route)}
          >
            {option.icon}
            {isOpen && <span className="menu-text">{option.name}</span>}
          </li>
        ))}
      </ul>

      <div className="navbar-footer">
        {isOpen && (
          <div className="user-info">
            <p className="user-name" style={{ fontSize: "20px" }}>{userRole}</p>
            <p className="user-name">{userName}</p>
            <p className="user-email">{currentUserEmail}</p>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          {isOpen && <span className="menu-text">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
