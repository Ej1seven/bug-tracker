import React from "react";
import SideBar from "../../Components/Sidebar/sidebar";
import SideBarSubmitter from "../../Components/Sidebar/sidebarSubmitter";
import SideBarStandard from "../../Components/Sidebar/sidebarStandard";
import SideBarProjectManager from "../../Components/Sidebar/sidebarProjectManager";
import Pagination from "../../Components/Pagination/usePagination";
import BugView from "../../Components/BugView/bugView";
import IdleTimer from "react-idle-timer";
import { IdleTimeOutModal } from "../../Components/IdleTimeOutModal/IdleTimeOutModal";
import { withRouter } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator";
import filterFactory, {
  textFilter,
  dateFilter,
} from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import * as ReactBootStrap from "react-bootstrap";
import "./roleAssignment.css";
import Header from "../../Components/Header/header";

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
    this.idleTimer = null;
    this.onAction = this._onAction.bind(this);
    this.onActive = this._onActive.bind(this);
    this.onIdle = this._onIdle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  _onAction(e) {
    console.log("user did something", e);
    this.setState({ isTimedOut: false });
  }

  _onActive(e) {
    console.log("user is active", e);
    this.setState({ isTimedOut: false });
  }

  _onIdle(e) {
    console.log("user is idle", e);
    const isTimedOut = this.state.isTimedOut;
    if (isTimedOut) {
      // this.setState({ userIsRegistered: false });
    } else {
      this.setState({ showModal: true });
      this.idleTimer.reset();
      this.setState({ isTimedOut: true });
    }
  }

  handleClose() {
    this.setState({ showModal: false });
  }

  handleLogout() {
    this.setState({ showModal: false });
    this.props.logUserOut();
    console.log(this.props.userLoginState);
    this.props.history.push("/");
  }

  fetchInfo = () => {
    fetch("https://murmuring-mountain-40437.herokuapp.com/users").then(
      (response) =>
        response.json().then((userList) => {
          console.log(userList);
          this.setState({ users: userList });
        })
    );
    fetch("https://murmuring-mountain-40437.herokuapp.com/bugs").then(
      (response) =>
        response.json().then((bugList) => {
          // console.log(bugs);
          console.log(this.state.bugs);
          let formattedBugs = bugList.map((bug) =>
            Object.assign({}, bug, {
              priority: this.getPriorityValue(bug.priority),
              created: this.getFormattedDate(bug.created),
            })
          );
          this.setState({ bugs: formattedBugs });

          // localStorage.setItem("bugs", this.props.messageId);
        })
    );
    fetch(
      `https://murmuring-mountain-40437.herokuapp.com/profile/${this.props.id}`
    ).then((response) =>
      response.json().then((userProfile) => {
        console.log(userProfile);
        this.setState({ user: userProfile });
        console.log(this.state.user.name);
        console.log(this.state.bugs);
        let filteredBugs = this.state.bugs.filter(
          (bug) =>
            bug.creator == this.state.user.name ||
            bug.assigned == this.state.user.name
        );
        this.setState({ myBugs: filteredBugs });
        console.log(this.state.myBugs);
      })
    );
  };

  getPriorityValue = (value) => {
    if (value == 1) {
      return "High";
    } else if (value == 2) {
      return "Medium";
    } else {
      return "Low";
    }

    //   this.setState({ myBugs: filteredBugs });
    //   console.log(this.state.bugs);
    //   console.log(this.state.myBugs);
    //   console.log(this.state.bugs);
    // let filteredBugs = [];
    // filteredBugs = this.state.bugs.filter(
    //   (bug) => bug.creator === this.state.user.name
    // );
  };

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
    // => "02/17/2017, 11:32 PM"

    dateString = dateString
      .replace(",", "")
      .replace("PM", "p.m.")
      .replace("AM", "a.m.");

    return dateString;
  };

  componentDidMount = () => {
    this.fetchInfo();
  };

  inputChanged = (e) => {
    e.preventDefault();
    let formInput = { ...this.state.formInput };
    formInput[e.target.name] = e.target.value;
    this.setState({
      formInput,
    });
  };

  selectUsers = (e) => {
    let userId = e.target.value;
    let addedUser = this.state.users.find(function (user) {
      return user.id == userId;
    });

    if (this.state.selectedUsers.includes(addedUser)) {
      let index = this.state.selectedUsers.indexOf(addedUser);
      this.state.selectedUsers.splice(index, 1);
    } else {
      this.state.selectedUsers.push(addedUser);
    }
    console.log(this.state.selectedUsers);
  };

  selectRole = (e) => {
    e.preventDefault();

    this.setState({ selectedRole: e.target[e.target.selectedIndex].text });
    console.log(e.target[e.target.selectedIndex].text);
  };

  submit = () => {
    console.log(this.state.selectedUsers);
    console.log(this.state.selectedRole);
    this.state.selectedUsers.map((user) => {
      fetch("https://murmuring-mountain-40437.herokuapp.com/editUser", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          role: this.state.selectedRole,
        }),
      }).then((response) =>
        response.json().then((res) => {
          console.log(res);
        })
      );
    });
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

    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        console.log(`clicked on row with index: ${rowIndex}`);
      },
    };

    const rowClasses = (row, rowIndex) => {
      return "row";
    };

    // const cellEdit = cellEditFactory({
    //   mode: "click",
    // });

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
              <div className="role-assignment-title">
                <h1>Manage User Roles</h1>
              </div>
              <div className="role-assignment-container">
                <div className="select-role-container">
                  <div className="mybugs-container-list">
                    <h3>Select One or more Users</h3>
                    <form>
                      <select
                        name="selectedUsers"
                        onClick={this.selectUsers}
                        value={this.state.selectedUser}
                        multiple
                      >
                        {this.state.users.map((user) => (
                          <option value={user.id}>{user.name}</option>
                        ))}
                      </select>
                      <h3>Select the Role to assign</h3>
                      <select
                        name="assignedRole"
                        required
                        onChange={this.selectRole}
                      >
                        <option>Select Role..</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Submitter">Submitter</option>
                        <option value="Developer">Developer</option>
                      </select>
                    </form>
                    <button type="submit" onClick={this.submit}>
                      SUBMIT
                    </button>
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
                        <SearchBar {...props.searchProps} />
                        <BootstrapTable
                          keyField="id"
                          data={dataTwo}
                          columns={columnsTwo}
                          {...props.baseProps}
                          filter={filterFactory()}
                          pagination={pagination}
                          // rowEvents={rowEvents}
                          rowClasses={rowClasses}
                          // cellEdit={cellEdit}
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
