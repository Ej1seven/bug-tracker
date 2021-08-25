import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Link } from "react-router-dom";
import { LogoutButton } from "../../Components/logoutButton/logoutButton";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import logo from "../../Pages/Login/blackLogo.png";
import "./sidebar.css";

const SideBarSubmitter = ({ handleLogout, page }) => {
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
  return (
    <div className="sidebar effect8">
      <Link className="nav-link" to="/">
        <img className="logo" alt="logo" src={logo} />
      </Link>
      <List>
        <ListItem className={page == "dashboard" ? "selected-link" : null}>
          <Button onClick={() => handleOnSubmit(1)}>Dashboard</Button>
        </ListItem>
        <ListItem className={page == "view-tickets" ? "selected-link" : null}>
          <Button onClick={() => handleOnSubmit(2)}> View All Tickets</Button>
        </ListItem>

        <ListItem className={page == "create-tickets" ? "selected-link" : null}>
          <Button onClick={() => handleOnSubmit(3)}> Create Tickets</Button>
        </ListItem>

        <ListItem className={page == "my-tickets" ? "selected-link" : null}>
          <Button onClick={() => handleOnSubmit(4)}>My Tickets</Button>
        </ListItem>
        <ListItem className={page == "my-projects" ? "selected-link" : null}>
          <Button onClick={() => handleOnSubmit(5)}> My Projects</Button>
        </ListItem>
      </List>
      <LogoutButton handleLogout={handleLogout} />
    </div>
  );
};

export default SideBarSubmitter;
