import React from "react";
import SideBar from "../../Components/Sidebar/sidebar";
import SideBarSubmitter from "../../Components/Sidebar/sidebarSubmitter";
import SideBarStandard from "../../Components/Sidebar/sidebarStandard";
import SideBarProjectManager from "../../Components/Sidebar/sidebarProjectManager";
import Pagination from "../../Components/Pagination/usePagination";
import "./mybugs.css";
import BugView from "../../Components/BugView/bugView";
import IdleTimer from "react-idle-timer";
import { IdleTimeOutModal } from "../../Components/IdleTimeOutModal/IdleTimeOutModal";
import { withRouter } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import * as ReactBootStrap from "react-bootstrap";
import Header from "../../Components/Header/header";

class MyBugs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bugs: [],
      myBugs: [],
      displayBug: {
        name: "",
        isDisplayed: false,
        id: 0,
      },
      user: {},
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
    // console.log(bug.priority);
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
        headerClasses: "hide-column",
        classes: "hide-column",
      },
      {
        dataField: "assigned",
        text: "Assigned Dev",
        sort: true,
        formatter: (cell) => <p> {cell} </p>,
        headerClasses: "hide-column",
        classes: "hide-column",
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
        headerClasses: "hide-column",
        classes: "hide-column",
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
    const data = this.state.myBugs;

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
      if (row.priority == "High") {
        return "high";
      } else if (row.priority == "Medium") {
        return "medium";
      } else {
        return "low";
      }
    };
    // const rowClasses = (row, rowIndex) => {
    //   return "row";
    // };

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
              <SideBar handleLogout={this.handleLogout} page="my-tickets" />
            </>
          )}
          {this.state.user.role == "Submitter" && (
            <>
              {" "}
              <SideBarSubmitter
                handleLogout={this.handleLogout}
                page="my-tickets"
              />
            </>
          )}
          {this.state.user.role == "Developer" && (
            <>
              {" "}
              <SideBarStandard
                handleLogout={this.handleLogout}
                page="my-tickets"
              />
            </>
          )}
          {this.state.user.role == "Project Manager" && (
            <>
              {" "}
              <SideBarProjectManager
                handleLogout={this.handleLogout}
                page="my-tickets"
              />
            </>
          )}{" "}
          <div className="myBugs-background">
            <div className="header effect9">
              <Header
                user={this.state.user}
                handleLogout={this.handleLogout}
                page="My Tickets"
              />
            </div>
            <div className="mybugs-container">
              <div className="mybugs-container-list">
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
                <ToolkitProvider
                  keyField="id"
                  data={data}
                  columns={columns}
                  search
                >
                  {(props) => (
                    <div className="myBugs-table">
                      <SearchBar
                        className="search-bar-mytickets"
                        {...props.searchProps}
                      />
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
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(MyBugs);
