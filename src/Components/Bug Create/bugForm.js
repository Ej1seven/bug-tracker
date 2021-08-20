import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import SideBar from "../../Components/Sidebar/sidebar";
import SideBarSubmitter from "../../Components/Sidebar/sidebarSubmitter";
import SideBarStandard from "../../Components/Sidebar/sidebarStandard";
import SideBarProjectManager from "../../Components/Sidebar/sidebarProjectManager";
import Header from "../../Components/Header/header";

import "./bugForm.css";

class BugForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formInput: {
        name: "",
        details: "",
        steps: "",
        priority: "",
        assigned: "",
        status: "",
        project: "",
      },
      user: {},
      users: [],
      projects: [],
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  inputChanged = (e) => {
    e.preventDefault();
    let formInput = { ...this.state.formInput };
    formInput[e.target.name] = e.target.value;
    this.setState({
      formInput,
    });
    console.log("email", JSON.stringify(formInput.email));
    console.log("password", JSON.stringify(formInput.password));
    console.log("name", JSON.stringify(formInput.name));
    console.log("priority", JSON.stringify(formInput.priority));
    console.log("project", JSON.stringify(formInput.project));
  };

  handleLogout() {
    this.props.logUserOut();
    console.log(this.props.userLoginState);
    // this.props.history.push("/");
  }

  redirect = () => {
    this.props.history.push("./viewbugs");
  };

  submit = (e) => {
    if (this.state.formInput.name === "") {
      alert("Please insert name");
    } else if (this.state.formInput.details === "") {
      alert("Please insert ticket description");
    } else if (this.state.formInput.priority === "") {
      alert("Please select priority level");
    } else if (this.state.formInput.assigned === "") {
      alert("Please assign ticket");
    } else if (this.state.formInput.status === "") {
      alert("Please insert ticket status");
    } else if (this.state.formInput.creator === "") {
      alert("Please input the creator");
    } else if (this.state.formInput.type === "") {
      alert("Please input ticket type");
    } else {
      fetch("https://murmuring-mountain-40437.herokuapp.com/bugs", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.state.formInput.name,
          details: this.state.formInput.details,
          type: this.state.formInput.type,
          priority: this.state.formInput.priority,
          assigned: this.state.formInput.assigned,
          status: this.state.formInput.status,
          project: this.state.formInput.project,
          creator: this.state.user.name,
        }),
      }).then((response) =>
        response.json().then((user) => {
          if (user) {
            console.log("Bug Created!");
            // this.props.goBackToDashboard();
            this.redirect();
            // this.setState({ userIsRegistered: true });
          }
        })
      );
    }
    e.preventDefault();
  };

  fetchInfo = () => {
    fetch(
      `https://murmuring-mountain-40437.herokuapp.com/profile/${this.props.id}`
    ).then((response) =>
      response.json().then((userProfile) => {
        console.log(userProfile);
        this.setState({ user: userProfile });
        console.log(this.state.user);
      })
    );
    fetch("https://murmuring-mountain-40437.herokuapp.com/users").then(
      (response) =>
        response.json().then((users) => {
          console.log(users);
          this.setState({ users: users });
          // console.log(this.state.bugs);
          // localStorage.setItem("bugs", this.props.messageId);
        })
    );
    fetch("https://murmuring-mountain-40437.herokuapp.com/getProjects").then(
      (response) =>
        response.json().then((projectsList) => {
          console.log(projectsList);
          this.setState({ projects: projectsList });
        })
    );
  };

  componentDidMount = () => {
    this.fetchInfo();
  };

  render() {
    return (
      <div className="dashboardBG">
        {this.state.user.role == "Administrator" && (
          <>
            {" "}
            <SideBar handleLogout={this.handleLogout} page="create-tickets" />
          </>
        )}
        {this.state.user.role == "Submitter" && (
          <>
            {" "}
            <SideBarSubmitter
              handleLogout={this.handleLogout}
              page="create-tickets"
            />
          </>
        )}
        {this.state.user.role == "Developer" && (
          <>
            {" "}
            <SideBarStandard
              handleLogout={this.handleLogout}
              page="create-tickets"
            />
          </>
        )}
        {this.state.user.role == "Project Manager" && (
          <>
            {" "}
            <SideBarProjectManager
              handleLogout={this.handleLogout}
              page="create-tickets"
            />
          </>
        )}{" "}
        <div className="bug-create">
          <div className="header effect9">
            <Header
              user={this.state.user}
              handleLogout={this.handleLogout}
              page="Create Tickets"
            />
          </div>
          {this.props.title === "Edit Bug" && (
            <button className="close-btn" onClick={this.props.close}>
              Close
            </button>
          )}
          <h1 className="create-title">{this.props.title}</h1>
          <form>
            <label>Title:</label>
            <input
              name="name"
              placeholder="Bug Name"
              required
              onChange={this.inputChanged}
              value={this.state.formInput.name}
            ></input>
            <label>Description:</label>
            <textarea
              name="details"
              placeholder="Detailed description on the bug"
              required
              onChange={this.inputChanged}
              value={this.state.formInput.details}
            ></textarea>
            <label>Ticket Priority:</label>
            <select
              name="priority"
              required
              onChange={this.inputChanged}
              value={this.state.formInput.priority}
            >
              <option>Choose Priority Level..</option>
              <option value="1">High</option>
              <option value="2">Mid</option>
              <option value="3">Low</option>
            </select>
            <label>Assigned Developer:</label>
            <select
              name="assigned"
              onChange={this.inputChanged}
              value={this.state.formInput.assigned}
            >
              <option>Assign To...</option>
              {this.state.users.map((user) => (
                <option value={user.name}>{user.name}</option>
              ))}
            </select>
            <label>Project:</label>
            <select
              name="project"
              onChange={this.inputChanged}
              value={this.state.formInput.project}
            >
              <option>Choose Project...</option>
              {this.state.projects.map((project) => (
                <option value={project.name}>{project.name}</option>
              ))}
            </select>
            <label>Ticket Status:</label>
            <select
              name="status"
              required
              onChange={this.inputChanged}
              value={this.state.formInput.status}
            >
              <option>Select Ticket Status..</option>
              <option value="New">New</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Additional Info Required">
                Additional Info Required
              </option>
              <option value="Closed">Closed</option>
            </select>
            <label>Ticket Type:</label>
            <select
              name="type"
              required
              onChange={this.inputChanged}
              value={this.state.formInput.type}
            >
              <option>Select Ticket Type..</option>
              <option value="Bug/Errors">Bug/Errors</option>
              <option value="Feature Requests">Feature Requests</option>
              <option value="Other Comments">Other Comments</option>
              <option value="Training/Document Request">
                Training/Document Request
              </option>
              <option value="Additional Info Required">
                Additional Info Required
              </option>
            </select>
            {/* <label>Creator:</label>
            <select
              name="creator"
              onChange={this.inputChanged}
              value={this.state.formInput.creator}
            >
              <option>Assigned...</option>
              <option value="Erik Hunter">Erik Hunter</option>
            </select> */}
            <button type="submit" onClick={this.submit}>
              {this.props.title}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(BugForm);
