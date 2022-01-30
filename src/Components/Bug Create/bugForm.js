import React from "react";
import { withRouter } from "react-router-dom";
import SideBar from "../../Components/Sidebar/sidebar";
import SideBarSubmitter from "../../Components/Sidebar/sidebarSubmitter";
import SideBarStandard from "../../Components/Sidebar/sidebarStandard";
import SideBarProjectManager from "../../Components/Sidebar/sidebarProjectManager";
import Header from "../../Components/Header/header";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Select from "@material-ui/core/Select";
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
  };

  handleLogout() {
    this.props.logUserOut();
  }

  redirect = () => {
    this.props.history.push("./viewbugs");
  };

  submit = (e) => {
    this.state.formInput.name === ""
      ? alert("Please insert name")
      : this.state.formInput.details === ""
      ? alert("Please insert ticket description")
      : this.state.formInput.priority === ""
      ? alert("Please select priority level")
      : this.state.formInput.assigned === ""
      ? alert("Please assign ticket")
      : this.state.formInput.status === ""
      ? alert("Please insert ticket status")
      : this.state.formInput.creator === ""
      ? alert("Please input the creator")
      : this.state.formInput.type === ""
      ? alert("Please input ticket type")
      : fetch("https://murmuring-mountain-40437.herokuapp.com/bugs", {
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
              this.redirect();
            }
          })
        );
    e.preventDefault();
  };

  fetchInfo = () => {
    fetch(
      `https://murmuring-mountain-40437.herokuapp.com/profile/${this.props.id}`
    ).then((response) =>
      response.json().then((userProfile) => {
        this.setState({ user: userProfile });
      })
    );
    fetch("https://murmuring-mountain-40437.herokuapp.com/users").then(
      (response) =>
        response.json().then((users) => {
          this.setState({ users: users });
        })
    );
    fetch("https://murmuring-mountain-40437.herokuapp.com/getProjects").then(
      (response) =>
        response.json().then((projectsList) => {
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
          <form>
            <InputBase
              name="name"
              placeholder="Bug Name"
              required
              onChange={this.inputChanged}
              value={this.state.formInput.name}
            ></InputBase>
            <TextareaAutosize
              minRows={5}
              name="details"
              placeholder="Detailed description on the bug"
              required
              onChange={this.inputChanged}
              value={this.state.formInput.details}
            ></TextareaAutosize>
            <Select
              native
              name="priority"
              required
              onChange={this.inputChanged}
              value={this.state.formInput.priority}
            >
              <option>Choose Priority Level..</option>
              <option value="1">High</option>
              <option value="2">Mid</option>
              <option value="3">Low</option>
            </Select>
            <Select
              native
              name="assigned"
              onChange={this.inputChanged}
              value={this.state.formInput.assigned}
            >
              <option>Assign To...</option>
              {this.state.users.map((user) => (
                <option value={user.name}>{user.name}</option>
              ))}
            </Select>
            <Select
              native
              name="project"
              onChange={this.inputChanged}
              value={this.state.formInput.project}
            >
              <option>Choose Project...</option>
              {this.state.projects.map((project) => (
                <option value={project.name}>{project.name}</option>
              ))}
            </Select>
            <Select
              native
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
            </Select>
            <Select
              native
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
            </Select>
            <Button className="submit-btn" type="submit" onClick={this.submit}>
              {this.props.title}
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(BugForm);
