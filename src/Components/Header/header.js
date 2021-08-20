import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Menu } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

import "./header.css";

const Header = (props) => {
  const history = useHistory();

  const routeChange = () => {
    let path = `/myprofile`;
    history.push(path);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="header-container shadow">
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
      <div className="large-screen-header shadow">
        <div className="large-screen-container">
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            Open Menu
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </div>
        <div className="large-screen-container large-screen-username">
          <p>
            Welcome {props.user.name} <span>({props.user.role})</span>
          </p>
        </div>
        <div className="large-screen-container profile">
          {/* <div className="profile-container" onClick={routeChange}>
            <div className="profile-container-text">Notifications</div>
            <i class="fas fa-bell"></i>
          </div>
          <div className="profile-container" onClick={routeChange}>
            <div className="profile-container-text">User Profile</div>
            <i class="fas fa-user"></i>
          </div> */}
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            Open Menu
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </div>
        {/* <div classname="large-screen-header">
        <p>
          Welcome {props.user.name} <span>({props.user.role})</span>
        </p>
      </div>
      <div classname="large-screen-header"></div>
      <div classname="large-screen-header"></div> */}
      </div>
    </>
  );
};

export default Header;
