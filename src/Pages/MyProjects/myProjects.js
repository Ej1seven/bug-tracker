import React from 'react';
//Importing the SideBar components according the role assigned to the user
import SideBar from '../../Components/Sidebar/sidebar';
import SideBarSubmitter from '../../Components/Sidebar/sidebarSubmitter';
import SideBarStandard from '../../Components/Sidebar/sidebarStandard';
import SideBarProjectManager from '../../Components/Sidebar/sidebarProjectManager';
import './myProjects.css';
//Importing IdleTimer which is used to notify the user when their webpage has been inactive for 2 minutes
import IdleTimer from 'react-idle-timer';
//Importing IdleTimeOutModal which is the popup modal that displays a prompt asking the user if they would like to remain logged in or not
import { IdleTimeOutModal } from '../../Components/IdleTimeOutModal/IdleTimeOutModal';
import { withRouter } from 'react-router-dom';
//Importing the BugView component which displays the details of each tickets
import BugView from '../../Components/BugView/bugView';
//Importing react-bootstrap-table components
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
//Importing Header which displays the users name, role and user profile information
import Header from '../../Components/Header/header';
//Importing Material UI components
import Button from '@material-ui/core/Button';

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
        name: '',
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
      priority: '',
      date: '',
      projectDetails: {
        name: '',
        description: '',
      },
      selectedProject: {},
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
    console.log('user did something', e);
    this.setState({ isTimedOut: false });
  }
  //user is active
  _onActive(e) {
    console.log('user is active', e);
    this.setState({ isTimedOut: false });
  }
  //user is idle
  _onIdle(e) {
    const isTimedOut = this.state.isTimedOut;
    //if user has been inactive for longer that 2 minutes show the IdleTimeOutModal
    //reset the timer back to 0
    //and set the isTimedOut property to true
    if (!isTimedOut) {
      this.setState({ showModal: true });
      this.idleTimer.reset();
      this.setState({ isTimedOut: true });
    }
  }
  //Close the IdleTimeOutModal

  handleClose() {
    this.setState({ showModal: false });
  }
  //Log the user out of the application

  handleLogout() {
    this.setState({ showModal: false });
    this.props.logUserOut();
    console.log(this.props.userLoginState);
    this.props.history.push('/');
  }
  //newProjectPage function toggles the new project page
  newProjectPage = () => {
    this.setState({ projectPage: !this.state.projectPage });
  };
  //During the mounting phase of the React Life-cycle the myProjects component fetches data from the database
  componentDidMount = () => {
    this.fetchInfo();
  };
  //fetches ticket data and the user's profile data from the heroku database
  fetchInfo = () => {
    fetch('https://murmuring-mountain-40437.herokuapp.com/bugs').then(
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
      `https://murmuring-mountain-40437.herokuapp.com/users/${this.props.id}`
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
    //fetches all the users from the database
    fetch('https://murmuring-mountain-40437.herokuapp.com/users').then(
      (response) =>
        response.json().then((userList) => {
          this.setState({ users: userList });
        })
    );
    //fetches all the projects from the database
    fetch('https://murmuring-mountain-40437.herokuapp.com/getProjects').then(
      (response) =>
        response.json().then((projects) => {
          let projectsArray = [];
          //maps through the projects and returns the projects that the user is a part of
          projects.map((project) => {
            if (project.userIds.includes(Number(this.state.user.id))) {
              projectsArray.push(project);
            }
          });
          this.setState({ myProjects: projectsArray });
        })
    );
  };
  //this function takes the number value from the priority property and changes the format from a number to a description ( 1 = High, 2 = Medium, 3 = Low)
  getPriorityValue = (value) => {
    if (value == 1) {
      return 'High';
    } else if (value == 2) {
      return 'Medium';
    } else {
      return 'Low';
    }
  };
  //this function takes the original date from the created property and changes the format to a readable, clearly defined date
  getFormattedDate = (dateValue) => {
    var date = new Date(dateValue);
    var formatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    var dateString = date.toLocaleDateString('en-US', formatOptions);
    dateString = dateString
      .replace(',', '')
      .replace('PM', 'p.m.')
      .replace('AM', 'a.m.');
    return dateString;
  };
  //BugClicked toggles the ticket details popup and also filters the tickets by name and id to make sure the correct ticket is displayed
  BugClicked = (bug) => {
    this.setState({
      displayBug: {
        isDisplayed: !this.state.displayBug.isDisplayed,
        name: bug.name,
        id: bug.id,
      },
    });
  };
  //the addUserClicked function adds the selected user to the new project being created. This function is associated with the bootstrap table on the the newProjectsPage
  addUserClicked = (userId) => {
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
  };
  //the addUserClickedTwo function adds the selected user to the selected project . This function is associated with the bootstrap table on the the manageUsersPage
  addUserClickedTwo = (userId) => {
    let addedUser = this.state.users.find(function (user) {
      return user.id == userId;
    });
    if (this.state.selectedUsers.includes(addedUser)) {
      let index = this.state.selectedUsers.indexOf(addedUser);
      this.state.selectedUsers.splice(index, 1);
    } else {
      this.state.selectedUsers.push(addedUser);
    }
  };
  //submitProject function fires once the submit button is pressed on the newProjectsPage
  submitProject = () => {
    this.state.addedUsersIds.push(Number(this.state.user.id));
    fetch('https://murmuring-mountain-40437.herokuapp.com/addProject', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: this.state.projectDetails.name,
        description: this.state.projectDetails.description,
        userIds: this.state.addedUsersIds,
      }),
    }).then((response) =>
      response.json().then((user) => {
        if (user) {
          fetch(
            'https://murmuring-mountain-40437.herokuapp.com/getProjects'
          ).then((response) =>
            response.json().then((projects) => {
              //maps through the projects and returns the projects that the user is a part of
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
        }
      })
    );
  };
  //submitProject function fires once the submit button is pressed on the manageUsersPage
  submitEditedProject = () => {
    let selectedUserIds = this.state.selectedUsers.map((user) => {
      return Number(user.id);
    });
    //maps through all the user ids and makes sure the selected user is not already a member of the selected project
    selectedUserIds.map((userId) => {
      if (
        !this.state.selectedProject.userIds.includes(userId) ||
        this.state.selectedProject.userIds.length != selectedUserIds.length
      ) {
        //sends a fetch request to the database and updates the users in the selected project
        fetch(
          'https://murmuring-mountain-40437.herokuapp.com/editProjectUsers',
          {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userIds: selectedUserIds,
              id: this.state.selectedProject.id,
            }),
          }
        ).then((response) =>
          response.json().then((res) => {
            this.closeManageUsersPage();
          })
        );
      } else {
        console.log('user id list remained the same');
      }
    });
  };
  //takes the input from the project name and details sections then saves the values to the projectDetails property
  handleChange = (event) => {
    event.preventDefault();
    let projectDetails = { ...this.state.projectDetails };
    let { name, value } = event.target;
    projectDetails[name] = value;
    this.setState({
      projectDetails,
    });
  };
  //toggles the showdetailsPage
  showdetailsPage = (projectDetails) => {
    this.setState({ detailsPage: !this.state.detailsPage });
    this.setState({ selectedProject: projectDetails });
    //displays a list of the users assigned to a project
    projectDetails.userIds.map((selectedUserId) => {
      let selectedUser = this.state.users.filter(
        (user) => Number(user.id) == selectedUserId
      );
      return this.state.selectedUsers.push(selectedUser[0]);
    });
    //displays the tickets associated with the selected project
    let projectBugs = this.state.bugs.filter(
      (bug) => bug.project == projectDetails.name
    );
    this.setState({ bugsInSelectedProject: projectBugs });
  };
  //closes the details page
  closeDetailsPage = () => {
    this.setState({ detailsPage: false });
    this.setState({ selectedUsers: [] });
  };
  //closes the manage users page
  closeManageUsersPage = () => {
    this.props.history.go(0);
  };
  //toggles the manage users page
  showManageUsersPage = (projectDetails) => {
    this.setState({ manageUsersPage: true });
    this.setState({ detailsPage: !this.state.detailsPage });
    this.setState({ selectedProject: projectDetails });
    //displays a list of the users assigned to a project
    projectDetails.userIds.map((selectedUserId) => {
      let selectedUser = this.state.users.filter(
        (user) => Number(user.id) == selectedUserId
      );
      return this.state.selectedUsers.push(selectedUser[0]);
    });
  };

  render() {
    var columns = [
      {
        dataField: 'name',
        text: 'Name',
        sort: true,
        formatter: (cell) => <p>{cell} </p>,
        editCellClasses: 'cells',
      },
      {
        dataField: 'role',
        text: 'Role',
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
      },
      {
        dataField: 'id',
        text: 'Add User',
        sort: true,
        formatter: (cell) => <button className="add-user-btn">ADD</button>,
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            this.addUserClicked(row.id);
          },
        },
      },
    ];
    var columnsTwo = [
      {
        dataField: 'name',
        text: 'Project Name',
        sort: true,
        formatter: (cell) => (
          <div>
            <p>{cell} </p>
          </div>
        ),
        editCellClasses: 'cells',
        classes: 'project-name-column',
        headerClasses: 'project-name-header',
      },
      {
        dataField: 'description',
        text: 'Description',
        sort: true,
        formatter: (cell) => (
          <div>
            <p> {cell} </p>
          </div>
        ),
        classes: 'description-column',
        headerClasses: 'description-header',
      },
      {
        dataField: 'id',
        text: '',
        sort: true,
        formatter: (cell) => (
          //Assigns a value to the "Details" and "Manage users" list items so when clicked the correct page is displayed
          //Displays the manage users option only for users assigned to the Administrator and Project Manager role
          <div className="details-list-container">
            <ul>
              <li value="1">Details</li>
              {this.state.user.role == 'Administrator' && (
                <>
                  <li value="2">Manage Users</li>
                </>
              )}
              {this.state.user.role == 'Project Manager' && (
                <>
                  <li value="2">Manage Users</li>
                </>
              )}
            </ul>
          </div>
        ),
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            //displays the details page or manage users pages depending on if they click on the "Details" or "Manage Users" bullet point
            if (e.target.value == 1) {
              this.showdetailsPage(row);
            } else if (e.target.value == 2) {
              this.showManageUsersPage(row);
            }
          },
          classes: 'details-column',
        },
      },
    ];

    var columnsThree = [
      {
        dataField: 'name',
        text: 'Name',
        sort: true,
        formatter: (cell) => <p>{cell} </p>,
        editCellClasses: 'cells',
      },
      {
        dataField: 'role',
        text: 'Role',
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
      },
      {
        dataField: 'id',
        text: 'Add User',
        sort: true,
        formatter: (cell) => <button className="add-user-btn">ADD</button>,
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            this.addUserClickedTwo(row.id);
          },
        },
      },
    ];

    var columnsFour = [
      {
        dataField: 'name',
        text: 'Title',
        sort: true,
        formatter: (cell) => <p>{cell} </p>,
        editCellClasses: 'cells',
      },
      {
        dataField: 'creator',
        text: 'Submitter',
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
        classes: 'hide-column',
        headerClasses: 'hide-column',
      },
      {
        dataField: 'assigned',
        text: 'Assigned Dev',
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
        classes: 'hide-column',
        headerClasses: 'hide-column',
      },
      {
        dataField: 'priority',
        text: 'Priority',
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
      },
      {
        dataField: 'created',
        text: 'Created',
        sort: true,
        classes: 'hide-column',
        headerClasses: 'hide-column',
      },
      {
        dataField: 'id',
        text: 'View Ticket',
        formatter: (cell) => <p> More details </p>,
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            this.BugClicked(row);
          },
        },
      },
    ];

    const { SearchBar } = Search;
    //Users within the database
    const data = this.state.users;
    //Projects that contain the current user
    const dataTwo = this.state.myProjects;
    //Tickets within the selected project
    const dataThree = this.state.bugsInSelectedProject;

    const pagination = paginationFactory({
      sizePerPage: 5,
      lastPageText: '>>',
      firstPageText: '<<',
      nextPageText: '>',
      prePageText: '<',
      showTotal: true,
      alwaysShowAllBtns: true,
      hideSizePerPage: true,
    });
    //rowClasses changes the color of the row depending on the priority value
    //(High = red, Medium = yellow, Low = green)
    const rowClasses = (row, rowIndex) => {
      if (row.priority == 'High') {
        return 'high';
      } else if (row.priority == 'Medium') {
        return 'medium';
      } else if (row.priority == 'Low') {
        return 'low';
      } else {
        return '';
      }
    };
    //adds custom column styling to the bootstrap table
    const columnClasses = (row, rowIndex) => {
      return 'column';
    };
    //displays a lists of all the users that will be added to the project
    const listItems = this.state.addedUsers.map((user) => <li>{user.name}</li>);

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
          {this.state.user.role == 'Administrator' && (
            <>
              {' '}
              <SideBar handleLogout={this.handleLogout} page="my-projects" />
            </>
          )}
          {this.state.user.role == 'Submitter' && (
            <>
              {' '}
              <SideBarSubmitter
                handleLogout={this.handleLogout}
                page="my-projects"
              />
            </>
          )}
          {this.state.user.role == 'Developer' && (
            <>
              {' '}
              <SideBarStandard
                handleLogout={this.handleLogout}
                page="my-projects"
              />
            </>
          )}
          {this.state.user.role == 'Project Manager' && (
            <>
              {' '}
              <SideBarProjectManager
                handleLogout={this.handleLogout}
                page="my-projects"
              />
            </>
          )}{' '}
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
                        {this.state.user.role == 'Administrator' && (
                          <>
                            <Button onClick={this.newProjectPage}>
                              Create New Project
                            </Button>
                          </>
                        )}
                        {this.state.user.role == 'Project Manager' && (
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
                                rowClasses={rowClasses}
                                columnClasses={columnClasses}
                              />
                            </div>
                          )}
                        </ToolkitProvider>
                      </div>
                    ) : (
                      <div className="new-project-page">
                        <div className="create-project-btns">
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
                        </div>
                        <div className="project-details-container">
                          <div className="view-section">
                            <h2>Project Name</h2>
                            <textarea
                              onfocus=""
                              placeholder="Please enter project name"
                              defaultValue=""
                              onChange={this.handleChange}
                              name="name"
                            ></textarea>
                          </div>{' '}
                          <div className="view-section">
                            <h2>Project Description</h2>
                            <textarea
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
                            {this.state.addedUsers.length !== 0 && (
                              <div>
                                <ul>{listItems}</ul>
                              </div>
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
                                <div className="assign-personel">
                                  <SearchBar
                                    {...props.searchProps}
                                    className="assign-personel-searchbar"
                                  />
                                </div>
                                <BootstrapTable
                                  keyField="id"
                                  data={data}
                                  columns={columns}
                                  {...props.baseProps}
                                  filter={filterFactory()}
                                  pagination={pagination}
                                  rowClasses={rowClasses}
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
                      <h1 className="details-title-one">
                        Details for {this.state.selectedProject.name}
                      </h1>
                      <p className="project-description-p">
                        <span className="project-description-span">
                          Project Description:
                        </span>
                        {this.state.selectedProject.description}
                      </p>
                      <div className="project-table-container-one">
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
                              users={this.state.users}
                              projects={this.state.myProjects}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                        <div className="details-table-container">
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
                                  <div className="details-seachbar-container">
                                    <SearchBar
                                      className="details-seachbar"
                                      {...props.searchProps}
                                    />
                                  </div>
                                  <BootstrapTable
                                    keyField="id"
                                    data={dataThree}
                                    columns={columnsFour}
                                    {...props.baseProps}
                                    filter={filterFactory()}
                                    pagination={pagination}
                                    rowClasses={rowClasses}
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
              )}
            </>
          ) : (
            <>
              <div className="myProjects-background">
                <div className="header effect9">
                  <Header
                    user={this.state.user}
                    handleLogout={this.handleLogout}
                    page="My Projects"
                  />
                </div>
                <div className="mybugs-container manage-users">
                  <div className="create-project-btns manage-users-btns">
                    <button
                      className="header-button"
                      onClick={this.closeManageUsersPage}
                    >
                      Back
                    </button>
                    <button
                      className="header-button"
                      onClick={this.submitEditedProject}
                    >
                      Submit
                    </button>
                  </div>
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
                          <div className="assign-personel-searchbar-container">
                            <SearchBar
                              className="assign-personel-searchbar"
                              {...props.searchProps}
                            />
                          </div>
                          <BootstrapTable
                            keyField="id"
                            data={data}
                            columns={columnsThree}
                            {...props.baseProps}
                            filter={filterFactory()}
                            pagination={pagination}
                            rowClasses={rowClasses}
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
