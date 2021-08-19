import React from "react";
import Button from "@material-ui/core/Button";
import "./logoutButton.css";

export const LogoutButton = ({ handleLogout }) => {
  return (
    <div>
      <Button className="nav-link logout" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};
