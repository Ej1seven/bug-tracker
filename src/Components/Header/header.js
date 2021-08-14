import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./header.css";

const Header = (props) => {
  const history = useHistory();

  const routeChange = () => {
    let path = `/myprofile`;
    history.push(path);
  };

  return (
    <div className="header-container">
      <div className="username">
        <p>
          Welcome {props.user.name} <span>({props.user.role})</span>
        </p>
      </div>
      <div className="username profile">
        <div className="profile-container" onClick={routeChange}>
          <div className="profile-container-text">Notifications</div>
          <i class="fas fa-bell"></i>
        </div>
        <div className="profile-container" onClick={routeChange}>
          <div className="profile-container-text">User Profile</div>
          <i class="fas fa-user"></i>
        </div>
      </div>
    </div>
  );
};

export default Header;
