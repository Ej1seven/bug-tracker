import React from "react";
import "./logoutButton.css";

export const LogoutButton = ({ handleLogout }) => {
  return (
    <div>
      <button className="nav-link logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};
