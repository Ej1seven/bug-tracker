import React from "react";
//Importing the SideBar components according the role assigned to the user
import SideBar from "../../Components/Sidebar/sidebar";
import SideBarSubmitter from "../../Components/Sidebar/sidebarSubmitter";
import SideBarStandard from "../../Components/Sidebar/sidebarStandard";
import SideBarProjectManager from "../../Components/Sidebar/sidebarProjectManager";
//Importing IdleTimer which is used to notify the user when their webpage has been inactive for 2 minutes
import IdleTimer from "react-idle-timer";
//Importing IdleTimeOutModal which is the popup modal that displays a prompt asking the user if they would like to remain logged in or not
import { IdleTimeOutModal } from "../../Components/IdleTimeOutModal/IdleTimeOutModal";
//Importing withRouter from react-router which passes updated match, location, and history props to the Login component
import { withRouter } from "react-router-dom";
//Importing react-bootstrap-table components
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "./roleAssignment.css";
//Importing Header which displays the users name, role and user profile information
import Header from "../../Components/Header/header";
//Importing Material UI components
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";

class RoleAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formInput: {
        role: "",
      },
      bugs: [],
      myBugs: [],
      displayBug: {
        name: "",
        isDisplayed: false,
        id: 0,
      },
      user: {},
      users: [],
      selectedUsers: [],
      selectedRole: "",
      timeout: 1000 * 5 * 24,
      isTimedOut: false,
      showModal: false,
      priority: "",
      date: "",
    };
    //Settings used by the react-idle-timer
    //idleTimer start the idle timer on null
    this.idleTimer = null;
    //onAction tells the idle timer an action was performed and resets the idle timer
    this.onAction = this._onAction.bind(this);
    //onActive tells the idle timer the user is active rather that means moving the mouse, watching a video, etc
    this.onActive = this._onActive.bind(this);
    //onIdle tells the idle timer the user is idle after 2 minutes of inactivity has elapse
    this.onIdle = this._onIdle.bind(this);
    //binds the handleClose and handleLogout functions to the idle timer component to ensure the function
    //is executed whenever the associated button in pressed on the IdleTimeOutModal
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  //user did something

  _onAction(e) {
    console.log("user did something", e);
    this.setState({ isTimedOut: false });
  }
  //user is active
  _onActive(e) {
    console.log("user is active", e);
    this.setState({ isTimedOut: false });
  }
  //user is idle
  _onIdle(e) {
    console.log("user is idle", e);
    const isTimedOut = this.state.isTimedOut;
    if (!isTimedOut) {
      this.setState({ showModal: true });
      this.idleTimer.reset();
      this.setState({ isTimedOut: true });
    }
  }
  //refreshes the webpage
  redirect = () => {
    this.props.history.go(0);
  };
  //Close the IdleTimeOutModal
  handleClose() {
    this.setState({ showModal: false });
  }
  //Log the user out of the application
  handleLogout() {
    this.setState({ showModal: false });
    this.props.logUserOut();
    console.log(this.props.userLoginState);
    this.props.history.push("/");
  }
  //During the mounting phase of the React Life-cycle the myProjects component fetches data from the database
  componentDidMount = () => {
    this.fetchInfo();
  };
  //fetches ticket data and the user's profile data from the heroku database
  fetchInfo = () => {
    //fetches all the users from the database
    fetch("https://murmuring-mountain-40437.herokuapp.com/users").then(
      (response) =>
        response.json().then((userList) => {
          this.setState({ users: userList });
        })
    );
    //fetches ticket data and the user's profile data from the heroku database
    fetch("https://murmuring-mountain-40437.herokuapp.com/bugs").then(
      (response) =>
        response.json().then((bugList) => {
          //pulls all the tickets from the bugs table in the database then
          //changes the format of the priority property from a number value to a description ( 1 = High, 2 = Medium, 3 = Low)
          //also changes the format of the created property to a readable date
          let formattedBugs = bugList.map((bug) =>
            Object.assign({}, bug, {
              priority: this.getPriorityValue(bug.priority),
              created: this.getFormattedDate(bug.created),
            })
          );
          this.setState({ bugs: formattedBugs });
        })
    );
    //fetches the active user's profile from the database by using the user's unique id
    fetch(
      `https://murmuring-mountain-40437.herokuapp.com/profile/${this.props.id}`
    ).then((response) =>
      response.json().then((userProfile) => {
        this.setState({ user: userProfile });
        //filters through the tickets and returns the tickets that have been submitted by the user or assigned by the user
        let filteredBugs = this.state.bugs.filter(
          (bug) =>
            bug.creator == this.state.user.name ||
            bug.assigned == this.state.user.name
        );
        this.setState({ myBugs: filteredBugs });
      })
    );
  };
  //this function takes the number value from the priority property and changes the format from a number to a description ( 1 = High, 2 = Medium, 3 = Low)
  getPriorityValue = (value) => {
    if (value == 1) {
      return "High";
    } else if (value == 2) {
      return "Medium";
    } else {
      return "Low";
    }
  };
  //this function takes the original date from the created property and changes the format to a readable, clearly defined date
  getFormattedDate = (dateValue) => {
    var date = new Date(dateValue);
    var formatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    var dateString = date.toLocaleDateString("en-US", formatOptions);
    dateString = dateString
      .replace(",", "")
      .replace("PM", "p.m.")
      .replace("AM", "a.m.");
    return dateString;
  };
  //Takes the userId of the selected user from the dropdown menu and assigns the value to the selectedUsers property
  selectUsers = (e) => {
    e.preventDefault();
    let userId = e.target.value;
    console.log(userId);
    this.setState({ selectedUsers: userId });
  };
  //Takes the selected role from the dropdown menu and assigns the value to the selectedRole property
  selectRole = (e) => {
    e.preventDefault();
    this.setState({ selectedRole: e.target[e.target.selectedIndex].text });
  };
  //updated the selected users role in the database
  submit = () => {
    fetch("https://murmuring-mountain-40437.herokuapp.com/editUser", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: this.state.selectedUsers,
        role: this.state.selectedRole,
      }),
    }).then((response) =>
      response.json().then((res) => {
        alert("The users role has been changed!");
        this.redirect();
      })
    );
  };

  render() {
    var columns = [
      {
        dataField: "name",
        text: "Title",
        sort: true,
        formatter: (cell) => <p>{cell} </p>,
        editCellClasses: "cells",
      },
      {
        dataField: "creator",
        text: "Submitter",
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
      },
      {
        dataField: "assigned",
        text: "Assigned Dev",
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
      },
      {
        dataField: "priority",
        text: "Priority",
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
      },
      {
        dataField: "created",
        text: "Created",
        sort: true,
      },
      {
        dataField: "id",
        text: "View Ticket",
        formatter: (cell) => <p> More details {cell} </p>,
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            // console.log(row.id);
            // console.log(row.priority);
            this.BugClicked(row);
          },
        },
      },
    ];

    var columnsTwo = [
      {
        dataField: "name",
        text: "Name",
        sort: true,
        formatter: (cell) => <p>{cell} </p>,
        editCellClasses: "cells",
      },
      {
        dataField: "email",
        text: "Email",
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
      },
      {
        dataField: "role",
        text: "Role",
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
      },
    ];

    const { SearchBar } = Search;
    const data = this.state.myBugs;
    const dataTwo = this.state.users;

    const pagination = paginationFactory({
      sizePerPage: 10,
      lastPageText: ">>",
      firstPageText: "<<",
      nextPageText: ">",
      prePageText: "<",
      showTotal: true,
      alwaysShowAllBtns: true,
      hideSizePerPage: true,
    });
    //rowClasses changes the margin-bottom to 2% for the bootstrap table
    const rowClasses = (row, rowIndex) => {
      return "row";
    };

    return (
      <>
        <IdleTimer
          ref={(ref) => {
            this.idleTimer = ref;
          }}
          element={document}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={1000}
          timeout={this.state.timeout}
        />
        <div className="myBugLayout">
          <IdleTimeOutModal
            showModal={this.state.showModal}
            handleClose={this.handleClose}
            handleLogout={this.handleLogout}
          />
          {this.state.user.role == "Administrator" && (
            <>
              {" "}
              <SideBar
                handleLogout={this.handleLogout}
                page="role-assignment"
              />
            </>
          )}
          {this.state.user.role == "Submitter" && (
            <>
              {" "}
              <SideBarSubmitter
                handleLogout={this.handleLogout}
                page="role-assignment"
              />
            </>
          )}
          {this.state.user.role == "Developer" && (
            <>
              {" "}
              <SideBarStandard
                handleLogout={this.handleLogout}
                page="role-assignment"
              />
            </>
          )}
          {this.state.user.role == "Project Manager" && (
            <>
              {" "}
              <SideBarProjectManager
                handleLogout={this.handleLogout}
                page="role-assignment"
              />
            </>
          )}{" "}
          <div className="myBugs-background">
            <div className="header effect9">
              <Header
                user={this.state.user}
                handleLogout={this.handleLogout}
                page="Manage User Roles"
              />
            </div>
            <div className="role-body-container">
              <div className="role-assignment-container">
                <div className="select-role-container">
                  <div className="mybugs-container-list">
                    <form>
                      <div className="select-role-containter">
                        <h3>Select A User</h3>

                        <Select
                          disableUnderline
                          native
                          name="selectedUsers"
                          onClick={this.selectUsers}
                          value={this.state.selectedUser}
                          InputProps={{ disableUnderline: true }}
                          className="selectUserOption"
                        >
                          <option>Select User..</option>
                          {this.state.users.map((user) => (
                            <option value={user.id}>{user.name}</option>
                          ))}
                        </Select>
                      </div>
                      <div className="select-role-containter">
                        <h3>Select the Role to assign</h3>
                        <Select
                          disableUnderline
                          native
                          name="assignedRole"
                          required
                          onChange={this.selectRole}
                          placeholder="Select Role..."
                          InputProps={{ disableUnderline: true }}
                        >
                          <option>Select Role..</option>
                          <option value="Administrator">Administrator</option>
                          <option value="Project Manager">
                            Project Manager
                          </option>
                          <option value="Submitter">Submitter</option>
                          <option value="Developer">Developer</option>
                        </Select>
                      </div>
                    </form>
                    <Button type="submit" onClick={this.submit}>
                      SUBMIT
                    </Button>
                  </div>
                </div>
                <div className="role-container">
                  <ToolkitProvider
                    keyField="id"
                    data={dataTwo}
                    columns={columnsTwo}
                    search
                  >
                    {(props) => (
                      <div className="users-table">
                        <SearchBar
                          className="users-table-seachbar"
                          {...props.searchProps}
                        />
                        <BootstrapTable
                          keyField="id"
                          data={dataTwo}
                          columns={columnsTwo}
                          {...props.baseProps}
                          filter={filterFactory()}
                          pagination={pagination}
                          rowClasses={rowClasses}
                          className="users-bootstrap-table"
                        />
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(RoleAssignment);
