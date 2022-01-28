import React from "react";
//Importing the SideBar components according the role assigned to the user
import SideBar from "../../Components/Sidebar/sidebar";
import SideBarSubmitter from "../../Components/Sidebar/sidebarSubmitter";
import SideBarStandard from "../../Components/Sidebar/sidebarStandard";
import SideBarProjectManager from "../../Components/Sidebar/sidebarProjectManager";
import "./viewBugs.css";
//Importing the BugView component which displays the details of each tickets
import BugView from "../../Components/BugView/bugView";
//Importing react-bootstrap-table components
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
//Importing IdleTimer which is used to notify the user when their webpage has been inactive for 2 minutes
import IdleTimer from "react-idle-timer";
//Importing IdleTimeOutModal which is the popup modal that displays a prompt asking the user if they would like to remain logged in or not
import { IdleTimeOutModal } from "../../Components/IdleTimeOutModal/IdleTimeOutModal";
//Importing withRouter from react-router which passes updated match, location, and history props to the Login component
import { withRouter } from "react-router-dom";
//Importing Header which displays the users name, role and user profile information
import Header from "../../Components/Header/header";

document.querySelector("html").classList.add("background");
class ViewBugs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bugs: [],
      user: {},
      users: [],
      projects: [],
      displayBug: {
        name: "",
        isDisplayed: false,
        id: 0,
      },
      timeout: 1000 * 5 * 24,
      isTimedOut: false,
      showModal: false,
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
  }
  //During the mounting phase of the React Life-cycle the viewBugs component fetches data from the database
  componentDidMount = () => {
    this.fetchInfo();
  };
  //fetches ticket data and the user's profile data from the heroku database
  fetchInfo = () => {
    fetch("https://murmuring-mountain-40437.herokuapp.com/bugs").then(
      (response) =>
        response.json().then((bugsList) => {
          //pulls all the tickets from the bugs table in the database then
          //changes the format of the priority property from a number value to a description ( 1 = High, 2 = Medium, 3 = Low)
          //also changes the format of the created property to a readable date
          let formattedBugs = bugsList.map((bug) =>
            Object.assign({}, bug, {
              priority: this.getPriorityValue(bug.priority),
              created: this.getFormattedDate(bug.created),
            })
          );
          this.setState({ bugs: formattedBugs });
          // this.setState({ bugs: bugsList });
          // console.log(this.state.bugs);
          // localStorage.setItem("bugs", this.props.messageId);
        })
    );
    //fetches the active users profile from the database by using the users unique id
    fetch(
      `https://murmuring-mountain-40437.herokuapp.com/profile/${this.props.id}`
    ).then((response) =>
      response.json().then((userProfile) => {
        this.setState({ user: userProfile });
      })
    );
    //fetches all the users from the database
    fetch("https://murmuring-mountain-40437.herokuapp.com/users").then(
      (response) =>
        response.json().then((userList) => {
          this.setState({ users: userList });
        })
    );
    //fetches all the projects from the database
    fetch("https://murmuring-mountain-40437.herokuapp.com/getProjects").then(
      (response) =>
        response.json().then((projects) => {
          this.setState({ projects: projects });
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
  //imports the formatted tickets from the database into the bootstrap table, and  divides the ticket properties by columns
  render() {
    var columns = [
      {
        dataField: "name",
        text: "Title",
        sort: true,
        formatter: (cell) => <p>{cell} </p>,
      },
      {
        dataField: "creator",
        text: "Submitter",
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
        classes: "hide-column",
        headerClasses: "hide-column",
      },
      {
        dataField: "assigned",
        text: "Assigned Dev",
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
        classes: "hide-column",
        headerClasses: "hide-column",
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
        classes: "hide-column",
        headerClasses: "hide-column",
      },
      {
        dataField: "id",
        text: "View Ticket",
        formatter: (cell) => <p> More details </p>,
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {
            this.BugClicked(row);
          },
          classes: "more-details",
        },
      },
    ];

    const { SearchBar } = Search;
    const data = this.state.bugs;

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

    const rowClasses = (row, rowIndex) => {
      if (row.priority == "High") {
        return "high";
      } else if (row.priority == "Medium") {
        return "medium";
      } else {
        return "low";
      }
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
        <div className="viewBugLayout">
          <IdleTimeOutModal
            showModal={this.state.showModal}
            handleClose={this.handleClose}
            handleLogout={this.handleLogout}
          />
          {this.state.displayBug.isDisplayed && (
            <BugView
              clicked={this.BugClicked}
              bug={
                this.state.bugs.filter(
                  (bug) =>
                    bug.name == this.state.displayBug.name &&
                    bug.id == this.state.displayBug.id
                )[0]
              }
              bugList={this.state.bugs}
              user={this.state.user}
              users={this.state.users}
              projects={this.state.projects}
            />
          )}
          {this.state.user.role == "Administrator" && (
            <>
              {" "}
              <SideBar handleLogout={this.handleLogout} page="view-tickets" />
            </>
          )}
          {this.state.user.role == "Submitter" && (
            <>
              {" "}
              <SideBarSubmitter
                handleLogout={this.handleLogout}
                page="view-tickets"
              />
            </>
          )}
          {this.state.user.role == "Developer" && (
            <>
              {" "}
              <SideBarStandard
                handleLogout={this.handleLogout}
                page="view-tickets"
              />
            </>
          )}
          {this.state.user.role == "Project Manager" && (
            <>
              {" "}
              <SideBarProjectManager
                handleLogout={this.handleLogout}
                page="view-tickets"
              />
            </>
          )}{" "}
          <div className="page-container">
            {/* {this.state.bugs.map((bug, idx) => (
              <BugCard
                id={idx}
                bug={bug}
                clicked={this.BugClicked}
                bugList={this.state.bugs}
              />
            ))} */}

            <div className="header effect9">
              <Header
                user={this.state.user}
                handleLogout={this.handleLogout}
                page="View Tickets"
              />
            </div>
            <ToolkitProvider keyField="id" data={data} columns={columns} search>
              {(props) => (
                <div className="myBugs-table">
                  <div className="search-bar-viewtickets">
                    <SearchBar
                      className="search-bar-view"
                      placeholder="Search"
                      {...props.searchProps}
                    />
                  </div>
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
      </>
    );
  }
}

export default withRouter(ViewBugs);
