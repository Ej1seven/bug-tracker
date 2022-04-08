import React from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Menu } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

import "./header.css";

const Header = ({ handleLogout, page, user }) => {
  const history = useHistory();

  const handleOnSubmit = (route) => {
    switch (route) {
      case 1:
        history.push(`/`);
        break;
      case 2:
        history.push(`/viewbugs`);
        break;
      case 3:
        history.push(`/create`);
        break;
      case 4:
        history.push(`/mybugs`);
        break;
      case 5:
        history.push(`/myprojects`);
        break;
      case 6:
        history.push(`/userroles`);
    }
  };

  const routeChange = () => {
    let path = `/myprofile`;
    history.push(path);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElTwo, setAnchorElTwo] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickTwo = (event) => {
    setAnchorElTwo(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElTwo(null);
  };

  return (
    <>
      <div className="header-container shadow">
        <div
          className={
            "username pagename" +
            (page !== "dashboard" ? "hide" : "dashboard-header")
          }
        >
          {page == "dashboard" ? (
            <p>
              Welcome {user.name} <span>({user.role})</span>
            </p>
          ) : (
            <p classNname="page-title">{page}</p>
          )}
        </div>
        <div
          className={
            "username profile " +
            (page !== "dashboard" ? "hide" : "dashboard-header")
          }
        >
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
            className="popup-btn"
          >
            <i class="fas fa-bars fa-2x "></i>
            <i class="fas fa-bars  fa-lg"></i>
          </Button>
          {user.role == "Administrator" ? (
            <>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => handleOnSubmit(1)}
                  className={page == "dashboard" ? "selected-link" : null}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(2)}
                  className={page == "view-tickets" ? "selected-link" : null}
                >
                  View All Tickets
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(3)}
                  className={page == "create-tickets" ? "selected-link" : null}
                >
                  {" "}
                  Create Tickets
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(4)}
                  className={page == "my-tickets" ? "selected-link" : null}
                >
                  My Tickets
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(5)}
                  className={page == "my-projects" ? "selected-link" : null}
                >
                  My Projects
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(6)}
                  className={page == "role-assignment" ? "selected-link" : null}
                >
                  Manage Role Assignment
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : null}
          {user.role == "Project Manager" ? (
            <>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => handleOnSubmit(1)}
                  className={page == "dashboard" ? "selected-link" : null}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(2)}
                  className={page == "view-tickets" ? "selected-link" : null}
                >
                  View All Tickets
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(3)}
                  className={page == "create-tickets" ? "selected-link" : null}
                >
                  {" "}
                  Create Tickets
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(4)}
                  className={page == "my-tickets" ? "selected-link" : null}
                >
                  My Tickets
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(5)}
                  className={page == "my-projects" ? "selected-link" : null}
                >
                  My Projects
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : null}
          {user.role == "Submitter" ? (
            <>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => handleOnSubmit(1)}
                  className={page == "dashboard" ? "selected-link" : null}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(2)}
                  className={page == "view-tickets" ? "selected-link" : null}
                >
                  View All Tickets
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(3)}
                  className={page == "create-tickets" ? "selected-link" : null}
                >
                  {" "}
                  Create Tickets
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(4)}
                  className={page == "my-tickets" ? "selected-link" : null}
                >
                  My Tickets
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(5)}
                  className={page == "my-projects" ? "selected-link" : null}
                >
                  My Projects
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : null}
          {user.role == "Developer" ? (
            <>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => handleOnSubmit(1)}
                  className={page == "dashboard" ? "selected-link" : null}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(2)}
                  className={page == "View Tickets" ? "selected-link" : null}
                >
                  View All Tickets
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(4)}
                  className={page == "my-tickets" ? "selected-link" : null}
                >
                  My Tickets
                </MenuItem>
                <MenuItem
                  onClick={() => handleOnSubmit(5)}
                  className={page == "my-projects" ? "selected-link" : null}
                >
                  My Projects
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : null}
        </div>
        <div className="large-screen-container large-screen-username">
          {page == "dashboard" ? (
            <p>
              Welcome {user.name} <span>({user.role})</span>
            </p>
          ) : (
            <p>{page}</p>
          )}
        </div>
        <div className="large-screen-container profile">
          <Button
            aria-controls="simple-menu-two"
            aria-haspopup="true"
            onClick={handleClickTwo}
            className="popup-btn"
          >
            User Actions
          </Button>
          <Menu
            id="simple-menu-two"
            anchorElTwo={anchorElTwo}
            keepMounted
            open={Boolean(anchorElTwo)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: 380, horizontal: -215 }}
          >
            <MenuItem onClick={routeChange}>
              {" "}
              <i class="fas fa-user"></i>User Profile
            </MenuItem>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default Header;
