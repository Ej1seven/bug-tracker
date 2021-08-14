import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogoutButton } from "../../Components/logoutButton/logoutButton";

import logo from "../../Pages/Login/Logo.png";
import "./sidebar.css";

const SideBar = ({ handleLogout }) => {
  return (
    <div className="sidebar">
      <Link className="nav-link" to="/">
        <img className="logo" alt="logo" src={logo} />
      </Link>
      <ul>
        <li>
          <Link to="/" className="nav-link">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/viewbugs" className="nav-link">
            View All Tickets
          </Link>
        </li>

        <li>
          <Link to="/create" className="nav-link">
            Create Tickets
          </Link>
        </li>

        <li>
          <Link to="/mybugs" className="nav-link">
            My Tickets
          </Link>
        </li>
        <li>
          <Link to="/myprojects" className="nav-link">
            My Projects
          </Link>
        </li>

        <li>
          <Link to="/userroles" className="nav-link">
            Manage Role Assignment
          </Link>
        </li>
      </ul>
      <LogoutButton handleLogout={handleLogout} />
    </div>
  );
};

export default SideBar;
