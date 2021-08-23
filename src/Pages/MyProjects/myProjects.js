import React from "react";
import SideBar from "../../Components/Sidebar/sidebar";
import SideBarSubmitter from "../../Components/Sidebar/sidebarSubmitter";
import SideBarStandard from "../../Components/Sidebar/sidebarStandard";
import SideBarProjectManager from "../../Components/Sidebar/sidebarProjectManager";
import "./myProjects.css";
import IdleTimer from "react-idle-timer";
import { IdleTimeOutModal } from "../../Components/IdleTimeOutModal/IdleTimeOutModal";
import { withRouter } from "react-router-dom";
import BugView from "../../Components/BugView/bugView";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import Header from "../../Components/Header/header";
import Button from "@material-ui/core/Button";

class MyProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectPage: false,
      detailsPage: false,
      manageUsersPage: false,
      bugs: [],
      myBugs: [],
      bugsInSelectedProject: [],
      myProjects: [],
      displayBug: {
        name: "",
        isDisplayed: false,
        id: 0,
      },
      user: {},
      users: [],
      addedUsers: [],
      addedUsersIds: [],
      selectedUsers: [],
      timeout: 1000 * 5 * 24,
      isTimedOut: false,
      showModal: false,
      priority: "",
      date: "",
      projectDetails: {
        name: "",
        description: "",
      },
      selectedProject: {},
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

  newProjectPage = () => {
    this.setState({ projectPage: !this.state.projectPage });
  };

  fetchInfo = () => {
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
    fetch("https://murmuring-mountain-40437.herokuapp.com/users").then(
      (response) =>
        response.json().then((userList) => {
          console.log(userList);
          this.setState({ users: userList });
        })
    );
    fetch("https://murmuring-mountain-40437.herokuapp.com/getProjects").then(
      (response) =>
        response.json().then((projects) => {
          let projectsArray = [];
          projects.map((project) => {
            if (project.userIds.includes(Number(this.state.user.id))) {
              projectsArray.push(project);
            }
          });
          this.setState({ myProjects: projectsArray });
          console.log(this.state.myProjects);
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

  // const [DISPLAY_BUG, SET_DISPLAY_BUG] = useState({
  //   name:'',
  //   isDisplayed:false
  // });

  // const dispatch = useDispatch();

  // const {bugs} = useSelector(state => state)

  // useEffect(() => {
  //     dispatch(getBugs());
  // },[])

  BugClicked = (bug) => {
    this.setState({
      displayBug: {
        isDisplayed: !this.state.displayBug.isDisplayed,
        name: bug.name,
        id: bug.id,
      },
    });
    // console.log(bug.id);
    // console.log(bug.name);
    // console.log(this.state.displayBug.id);
    // console.log(this.state.displayBug.name);
    // console.log(bug.name);
    // console.log(bug.id);
  };

  addUserClicked = (userId) => {
    // console.log(userId);
    let addedUser = this.state.users.find(function (user) {
      return user.id == userId;
    });
    if (this.state.addedUsers.includes(addedUser)) {
      let index = this.state.addedUsers.indexOf(addedUser);
      this.state.addedUsers.splice(index, 1);
    } else {
      this.state.addedUsers.push(addedUser);
    }

    if (this.state.addedUsersIds.includes(userId)) {
      let index = this.state.addedUsersIds.indexOf(userId);
      this.state.addedUsersIds.splice(index, 1);
    } else {
      this.state.addedUsersIds.push(Number(userId));
    }

    // console.log(addedUser);
    // console.log(this.state.addedUsers);
    // console.log(this.state.addedUsersIds);
  };

  addUserClickedTwo = (userId) => {
    // console.log(userId);
    let addedUser = this.state.users.find(function (user) {
      return user.id == userId;
    });
    if (this.state.selectedUsers.includes(addedUser)) {
      let index = this.state.selectedUsers.indexOf(addedUser);
      this.state.selectedUsers.splice(index, 1);
    } else {
      this.state.selectedUsers.push(addedUser);
    }

    // if (this.state.selectedProject.userIds.includes(userId)) {
    //   let index = this.state.selectedProject.userIds.indexOf(userId);
    //   this.state.selectedProject.userIds.splice(index, 1);
    // } else {
    //   this.state.selectedProject.userIds.push(Number(userId));
    // }

    // console.log(addedUser);
    // console.log(this.state.addedUsers);
    // console.log(this.state.addedUsersIds);
  };

  submitProject = () => {
    this.state.addedUsersIds.push(Number(this.state.user.id));
    console.log(this.state.projectDetails.name);
    console.log(this.state.projectDetails.description);
    console.log(this.state.addedUsers);
    console.log(this.state.addedUsersIds);
    console.log(this.state.user.id);

    fetch("https://murmuring-mountain-40437.herokuapp.com/addProject", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: this.state.projectDetails.name,
        description: this.state.projectDetails.description,
        userIds: this.state.addedUsersIds,
      }),
    }).then((response) =>
      response.json().then((user) => {
        if (user) {
          console.log(user);
          // this.props.goBackToDashboard();
          fetch(
            "https://murmuring-mountain-40437.herokuapp.com/getProjects"
          ).then((response) =>
            response.json().then((projects) => {
              let projectsArray = [];
              projects.map((project) => {
                if (project.userIds.includes(Number(this.state.user.id))) {
                  projectsArray.push(project);
                }
              });
              this.setState({ myProjects: projectsArray });
            })
          );
          this.newProjectPage();
          // this.setState({ userIsRegistered: true });
        }
      })
    );
  };

  submitEditedProject = () => {
    let selectedUserIds = this.state.selectedUsers.map((user) => {
      return Number(user.id);
    });
    console.log(this.state.selectedProject.userIds);
    console.log(selectedUserIds);
    console.log(this.state.selectedProject.id);
    selectedUserIds.map((userId) => {
      if (
        !this.state.selectedProject.userIds.includes(userId) ||
        this.state.selectedProject.userIds.length != selectedUserIds.length
      ) {
        console.log("user id list has changed");
        fetch(
          "https://murmuring-mountain-40437.herokuapp.com/editProjectUsers",
          {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userIds: selectedUserIds,
              id: this.state.selectedProject.id,
            }),
          }
        ).then((response) =>
          response.json().then((res) => {
            console.log(res);
            this.closeManageUsersPage();
          })
        );
      } else {
        console.log("user id list remained the same");
      }
    });
    // this.state.addedUsersIds.push(Number(this.state.user.id));
    // console.log(this.state.projectDetails.name);
    // console.log(this.state.projectDetails.description);
    // console.log(this.state.addedUsers);
    // console.log(this.state.addedUsersIds);
    // console.log(this.state.user.id);
    // fetch("http://localhost:4001/addProject", {
    //   method: "post",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     name: this.state.projectDetails.name,
    //     description: this.state.projectDetails.description,
    //     userIds: this.state.addedUsersIds,
    //   }),
    // }).then((response) =>
    //   response.json().then((user) => {
    //     if (user) {
    //       console.log(user);
    //       // this.props.goBackToDashboard();
    //       fetch("http://localhost:4001/getProjects").then((response) =>
    //         response.json().then((projects) => {
    //           let projectsArray = [];
    //           projects.map((project) => {
    //             if (project.userIds.includes(Number(this.state.user.id))) {
    //               projectsArray.push(project);
    //             }
    //           });
    //           this.setState({ myProjects: projectsArray });
    //         })
    //       );
    //       this.newProjectPage();
    //       // this.setState({ userIsRegistered: true });
    //     }
    //   })
    // );
  };

  handleChange = (event) => {
    event.preventDefault();
    let projectDetails = { ...this.state.projectDetails };
    let { name, value } = event.target;
    projectDetails[name] = value;
    this.setState({
      projectDetails,
    });
  };

  showdetailsPage = (projectDetails) => {
    console.log(projectDetails);
    console.log(projectDetails.userIds);
    this.setState({ detailsPage: !this.state.detailsPage });
    this.setState({ selectedProject: projectDetails });
    console.log(this.state.selectedProject);
    console.log(projectDetails);
    projectDetails.userIds.map((selectedUserId) => {
      let selectedUser = this.state.users.filter(
        (user) => Number(user.id) == selectedUserId
      );
      return this.state.selectedUsers.push(selectedUser[0]);
    });

    let projectBugs = this.state.bugs.filter(
      (bug) => bug.project == projectDetails.name
    );
    this.setState({ bugsInSelectedProject: projectBugs });
    console.log(this.state.selectedUsers);
  };

  closeDetailsPage = () => {
    this.setState({ detailsPage: false });
    this.setState({ selectedUsers: [] });
  };

  closeManageUsersPage = () => {
    this.props.history.go(0);
  };

  showManageUsersPage = (projectDetails) => {
    this.setState({ manageUsersPage: true });
    this.setState({ detailsPage: !this.state.detailsPage });
    this.setState({ selectedProject: projectDetails });
    console.log(this.state.selectedProject);
    console.log(projectDetails);
    projectDetails.userIds.map((selectedUserId) => {
      let selectedUser = this.state.users.filter(
        (user) => Number(user.id) == selectedUserId
      );
      return this.state.selectedUsers.push(selectedUser[0]);
    });
    console.log(this.state.selectedUsers);
  };

  render() {
    var columns = [
      {
        dataField: "name",
        text: "Name",
        sort: true,
        formatter: (cell) => <p>{cell} </p>,
        editCellClasses: "cells",
      },
      {
        dataField: "role",
        text: "Role",
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
      },
      {
        dataField: "id",
        text: "Add User",
        sort: true,
        formatter: (cell) => <button className="add-user-btn">ADD</button>,
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            // console.log(row.id);
            // console.log(row.priority);
            this.addUserClicked(row.id);
          },
        },
      },
    ];
    var columnsTwo = [
      {
        dataField: "name",
        text: "Project Name",
        sort: true,
        formatter: (cell) => (
          <div>
            <p>{cell} </p>
          </div>
        ),
        editCellClasses: "cells",
        classes: "project-name-column",
        headerClasses: "project-name-header",
      },
      {
        dataField: "description",
        text: "Description",
        sort: true,
        formatter: (cell) => (
          <div>
            <p> {cell} </p>
          </div>
        ),
        classes: "description-column",
        headerClasses: "description-header",
      },
      {
        dataField: "id",
        text: "",
        sort: true,
        formatter: (cell) => (
          <div className="details-list-container">
            <ul>
              <li value="1">Details</li>
              {this.state.user.role == "Administrator" && (
                <>
                  <li value="2">Manage Users</li>
                </>
              )}
              {this.state.user.role == "Project Manager" && (
                <>
                  <li value="2">Manage Users</li>
                </>
              )}
            </ul>
          </div>
        ),
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            // console.log(row.id);
            // console.log(row.priority);
            // console.log(row.id);
            if (e.target.value == 1) {
              this.showdetailsPage(row);
            } else if (e.target.value == 2) {
              this.showManageUsersPage(row);
            }
          },
          classes: "details-column",
        },
      },
    ];

    var columnsThree = [
      {
        dataField: "name",
        text: "Name",
        sort: true,
        formatter: (cell) => <p>{cell} </p>,
        editCellClasses: "cells",
      },
      {
        dataField: "role",
        text: "Role",
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
      },
      {
        dataField: "id",
        text: "Add User",
        sort: true,
        formatter: (cell) => <button className="add-user-btn">ADD</button>,
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            // console.log(row.id);
            // console.log(row.priority);
            this.addUserClickedTwo(row.id);
          },
        },
      },
    ];

    var columnsFour = [
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

    const { SearchBar } = Search;
    const data = this.state.users;
    const dataTwo = this.state.myProjects;
    const dataThree = this.state.bugsInSelectedProject;

    const pagination = paginationFactory({
      sizePerPage: 5,
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
    const columnClasses = (row, rowIndex) => {
      return "column";
    };

    // const cellEdit = cellEditFactory({
    //   mode: "click",
    // });

    const listItems = this.state.addedUsers.map((user) => <li>{user.name}</li>);
    // const projectBugs = this.state.bugs.filter(
    //   (bug) => bug.project == this.state.selectedProject.name
    // );
    console.log(this.state.selectedProject.userIds);
    console.log(this.state.bugsInSelectedProject);

    // let selectedProjectUsers = this.state.selectedProject.userIds.map(
    //   (selectedUserId) => {
    //     let selectedUser = this.state.users.filter(
    //       (user) => Number(user.id) == selectedUserId
    //     );
    //     return console.log(selectedUser.name);
    //   }
    // );

    // this.state.selectedProject.userIds.map(
    //   (user) => <li>{user.name}</li>
    // );

    // const array = this.state.selectedProject.userIds.map((userId) => {
    //     return
    // })
    // console.log(this.state.selectedProject.userIds);

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
              <SideBar handleLogout={this.handleLogout} page="my-projects" />
            </>
          )}
          {this.state.user.role == "Submitter" && (
            <>
              {" "}
              <SideBarSubmitter
                handleLogout={this.handleLogout}
                page="my-projects"
              />
            </>
          )}
          {this.state.user.role == "Developer" && (
            <>
              {" "}
              <SideBarStandard
                handleLogout={this.handleLogout}
                page="my-projects"
              />
            </>
          )}
          {this.state.user.role == "Project Manager" && (
            <>
              {" "}
              <SideBarProjectManager
                handleLogout={this.handleLogout}
                page="my-projects"
              />
            </>
          )}{" "}
          {!this.state.manageUsersPage ? (
            <>
              {!this.state.detailsPage ? (
                <>
                  <div className="myProjects-background">
                    <div className="header effect9">
                      <Header
                        user={this.state.user}
                        handleLogout={this.handleLogout}
                        page="My Projects"
                      />
                    </div>
                    {!this.state.projectPage ? (
                      <div className="mybugs-container">
                        {this.state.user.role == "Administrator" && (
                          <>
                            <Button onClick={this.newProjectPage}>
                              Create New Project
                            </Button>
                          </>
                        )}
                        {this.state.user.role == "Project Manager" && (
                          <>
                            <button onClick={this.newProjectPage}>
                              Create New Project
                            </button>
                          </>
                        )}
                        <ToolkitProvider
                          keyField="id"
                          data={dataTwo}
                          columns={columnsTwo}
                          search
                        >
                          {(props) => (
                            <div className="myBugs-table">
                              <SearchBar
                                className="search-bar-myprojects"
                                {...props.searchProps}
                              />
                              <BootstrapTable
                                keyField="id"
                                data={dataTwo}
                                columns={columnsTwo}
                                {...props.baseProps}
                                filter={filterFactory()}
                                pagination={pagination}
                                // rowEvents={rowEvents}
                                rowClasses={rowClasses}
                                columnClasses={columnClasses}
                                // cellEdit={cellEdit}
                              />
                            </div>
                          )}
                        </ToolkitProvider>
                        {/* <div className="mybugs-container-list">
                {this.state.displayBug.isDisplayed ? (
                  <div>
                    <BugView
                      clicked={this.BugClicked}
                      bug={
                        this.state.myBugs.filter(
                          (bug, index) =>
                            bug.name == this.state.displayBug.name &&
                            bug.id == this.state.displayBug.id
                        )[0]
                      }
                      bugList={this.state.myBugs.bugs}
                      className="bug-view"
                      user={this.state.user}
                    />
                  </div>
                ) : (
                  <></>
                )}
                
                {/* </div> */}
                      </div>
                    ) : (
                      <div className="new-project-page">
                        <button
                          className="header-button"
                          onClick={this.newProjectPage}
                        >
                          Back
                        </button>
                        <button
                          className="header-button"
                          onClick={this.submitProject}
                        >
                          Submit
                        </button>
                        <h1>Create Project</h1>

                        <div className="project-details-container">
                          <div className="view-section">
                            <h2>Project Name</h2>
                            <textarea
                              //   className="bug-input"
                              onfocus=""
                              placeholder="Please enter project name"
                              defaultValue=""
                              onChange={this.handleChange}
                              name="name"
                            ></textarea>
                          </div>{" "}
                          <div className="view-section">
                            <h2>Project Description</h2>
                            <textarea
                              //   className="bug-input"
                              onfocus=""
                              placeholder="Please enter project description"
                              defaultValue=""
                              onChange={this.handleChange}
                              name="description"
                            ></textarea>
                          </div>
                        </div>
                        <div className="users-table-container">
                          <div className="user-table-title">
                            <h2>Assign Personnel</h2>
                            {this.state.addedUsers.length !== 0 ? (
                              <div>
                                <ul>{listItems}</ul>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                          <ToolkitProvider
                            keyField="id"
                            data={data}
                            columns={columns}
                            search
                          >
                            {(props) => (
                              <div className="users-table">
                                <SearchBar {...props.searchProps} />
                                <BootstrapTable
                                  keyField="id"
                                  data={data}
                                  columns={columns}
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
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="myProjects-background">
                    <div className="mybugs-container">
                      <button onClick={this.closeDetailsPage}>Back</button>
                      <h1>Details for {this.state.selectedProject.name}</h1>
                      <p className="project-description-p">
                        <span className="project-description-span">
                          Project Description:
                        </span>
                        {this.state.selectedProject.description}
                      </p>
                      <div className="project-table-container">
                        {this.state.displayBug.isDisplayed ? (
                          <div>
                            <BugView
                              clicked={this.BugClicked}
                              bug={
                                this.state.myBugs.filter(
                                  (bug, index) =>
                                    bug.name == this.state.displayBug.name &&
                                    bug.id == this.state.displayBug.id
                                )[0]
                              }
                              bugList={this.state.myBugs.bugs}
                              className="bug-view"
                              user={this.state.user}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="user-table-title">
                          <div className="assign-personel-container">
                            <h2 id="assign-personel-title">
                              Assigned Personnel
                            </h2>
                          </div>
                          {this.state.selectedProject.userIds.length !== 0 ? (
                            <div>
                              <ul>
                                {this.state.selectedUsers.map((user) => {
                                  return <li>{user.name}</li>;
                                })}
                              </ul>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="project-table-title">
                          <div className="assign-personel-container">
                            <h2 id="assign-personel-title">
                              Tickets for this project
                            </h2>
                          </div>

                          <ToolkitProvider
                            keyField="id"
                            data={dataThree}
                            columns={columnsFour}
                            search
                          >
                            {(props) => (
                              <div>
                                <SearchBar {...props.searchProps} />
                                <BootstrapTable
                                  keyField="id"
                                  data={dataThree}
                                  columns={columnsFour}
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
                </>
              )}
            </>
          ) : (
            <>
              <div className="myProjects-background">
                <div className="mybugs-container">
                  <button onClick={this.closeManageUsersPage}>Back</button>
                  <button
                    className="header-button"
                    onClick={this.submitEditedProject}
                  >
                    Submit
                  </button>
                  <h1>Manage Users for {this.state.selectedProject.name}</h1>
                  <div className="project-table-container">
                    <div className="user-table-title">
                      <div className="assign-personel-container">
                        <h2 id="assign-personel-title">Assigned Personnel</h2>
                      </div>
                      {this.state.selectedProject.userIds.length !== 0 ? (
                        <div>
                          <ul>
                            {this.state.selectedUsers.map((user) => {
                              return <li>{user.name}</li>;
                            })}
                          </ul>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <ToolkitProvider
                      keyField="id"
                      data={data}
                      columns={columnsThree}
                      search
                    >
                      {(props) => (
                        <div className="users-table">
                          <SearchBar {...props.searchProps} />
                          <BootstrapTable
                            keyField="id"
                            data={data}
                            columns={columnsThree}
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
            </>
          )}
        </div>
      </>
    );
  }
}

export default withRouter(MyProjects);
