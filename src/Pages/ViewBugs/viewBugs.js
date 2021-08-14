import React from "react";
import SideBar from "../../Components/Sidebar/sidebar";
import SideBarSubmitter from "../../Components/Sidebar/sidebarSubmitter";
import SideBarStandard from "../../Components/Sidebar/sidebarStandard";
import "./viewBugs.css";
import BugCard from "../../Components/BugCard/bugCard";
import BugView from "../../Components/BugView/bugView";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import IdleTimer from "react-idle-timer";
import { IdleTimeOutModal } from "../../Components/IdleTimeOutModal/IdleTimeOutModal";
import { withRouter } from "react-router-dom";

{
  /* <BootstrapTable keyField="name" data={this.state.myBugs} columns={this.state.columns} pagination={paginationFactory()} */
}

{
  /* <table>
<thead>
  <tr>
    <th>Title</th>
    <th>Submitter</th>
    <th>Assigned Dev</th>
    <th>Priority</th>
    <th>Created</th>
  </tr>
</thead>
<tbody>
  {this.state.myBugs.map((bug, idx) => (
    <tr>
      <td>{bug.name}</td>
      <td>{bug.creator}</td>
      <td>{bug.assigned}</td>
      <td priority={this.getPriorityValue(bug.priority)}>
        {this.state.priority}
      </td>
      <td date={this.getFormattedDate(bug.created)}>
        {this.state.date}
      </td>
    </tr>
  ))}
</tbody>
</table> */
}

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
      timeout: 1000 * 5 * 1,
      isTimedOut: false,
      showModal: false,
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
        response.json().then((bugsList) => {
          let formattedBugs = bugsList.map((bug) =>
            Object.assign({}, bug, {
              priority: this.getPriorityValue(bug.priority),
              created: this.getFormattedDate(bug.created),
            })
          );
          this.setState({ bugs: formattedBugs });
          // console.log(bugs);
          // this.setState({ bugs: bugsList });
          // console.log(this.state.bugs);
          // localStorage.setItem("bugs", this.props.messageId);
        })
    );
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
        response.json().then((userList) => {
          console.log(userList);
          this.setState({ users: userList });
        })
    );
    fetch("https://murmuring-mountain-40437.herokuapp.com/getProjects").then(
      (response) =>
        response.json().then((projects) => {
          this.setState({ projects: projects });
        })
    );
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

  BugClicked = (bug) => {
    this.setState({
      displayBug: {
        isDisplayed: !this.state.displayBug.isDisplayed,
        name: bug.name,
        id: bug.id,
      },
    });
    console.log(this.state.displayBug.id);
    console.log(this.state.displayBug.name);
    console.log(bug.id);

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
          {this.state.user.role == "Administrator" && (
            <>
              {" "}
              <SideBar handleLogout={this.handleLogout} />
            </>
          )}
          {this.state.user.role == "Submitter" && (
            <>
              {" "}
              <SideBarSubmitter handleLogout={this.handleLogout} />
            </>
          )}
          {this.state.user.role == "Developer" && (
            <>
              {" "}
              <SideBarStandard handleLogout={this.handleLogout} />
            </>
          )}
          {this.state.user.role == "Project Manager" && (
            <>
              {" "}
              <SideBarStandard handleLogout={this.handleLogout} />
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
            <ToolkitProvider keyField="id" data={data} columns={columns} search>
              {(props) => (
                <div className="myBugs-table">
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

            {this.state.displayBug.isDisplayed && (
              <BugView
                clicked={this.BugClicked}
                bug={
                  this.state.bugs.filter(
                    (bug, index) =>
                      bug.name == this.state.displayBug.name &&
                      index == this.state.displayBug.id
                  )[0]
                }
                bugList={this.state.bugs}
                user={this.state.user}
                users={this.state.users}
                projects={this.state.projects}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(ViewBugs);
