import React from "react";
import SideBar from "../../Components/Sidebar/sidebar";
import SideBarSubmitter from "../../Components/Sidebar/sidebarSubmitter";
import SideBarStandard from "../../Components/Sidebar/sidebarStandard";
import SideBarProjectManager from "../../Components/Sidebar/sidebarProjectManager";
import { Bar, Doughnut } from "react-chartjs-2";
import Card from "../../Components/Card/card";
import Header from "../../Components/Header/header";
import "./dashboard.css";
import { withRouter } from "react-router-dom";
import IdleTimer from "react-idle-timer";
import PropTypes from "prop-types";
import { IdleTimeOutModal } from "../../Components/IdleTimeOutModal/IdleTimeOutModal";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      bugs: {},
      myBugs: [],
      highCount: 0,
      midCount: 0,
      lowCount: 0,
      user: {},
      timeout: 1000 * 5 * 24,
      isTimedOut: false,
      showModal: false,
      chartData: {
        labels: ["Low", "Medium", "High"],
        datasets: [
          {
            label: "Ticket By Priority",
            data: [],
            backgroundColor: [
              "rgba(0, 255, 0, 0.5)",
              "rgba(255, 73, 0, 0.5)",
              "rgba(255, 0, 0, 0.5)",
            ],
            borderColor: [
              "rgba(0, 255, 0, 1)",
              "rgba(255, 73, 0, 1)",
              "rgba(255, 0, 0, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        animation: false,
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Tickets By Priority",
          },
        },
      },
      chartDataTwo: {
        labels: [
          "Bug/Errors",
          "Feature Requests",
          "Other Comments",
          "Training/Document Request",
          "Additional Info Required",
        ],
        datasets: [
          {
            label: "Ticket By Type",
            data: [],
            backgroundColor: [
              "rgba(0, 255, 0, 0.5)",
              "rgba(255, 73, 0, 0.5)",
              "rgba(255, 0, 0, 0.5)",
              "rgba(0, 0, 255, 0.5)",
              "rgba(226, 226, 7, 0.5)",
            ],
            borderColor: [
              "rgba(0, 255, 0, 1)",
              "rgba(255, 73, 0, 1)",
              "rgba(255, 0, 0, 1)",
              "rgba(0, 0, 255, 1)",
              "rgba(226, 226, 7, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      optionsTwo: {
        animation: {
          duration: 0,
        },
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: "Tickets By Type",
          },
        },
      },
      chartDataThree: {
        labels: [
          "New",
          "Open",
          "In Progress",
          "Resolved",
          "Additional Info Required",
        ],
        datasets: [
          {
            label: "Ticket By Status",
            data: [],
            backgroundColor: [
              "rgba(0, 255, 0, 0.5)",
              "rgba(255, 73, 0, 0.5)",
              "rgba(255, 0, 0, 0.5)",
              "rgba(0, 0, 255, 0.5)",
              "rgba(226, 226, 7, 0.5)",
            ],
            borderColor: [
              "rgba(0, 255, 0, 1)",
              "rgba(255, 73, 0, 1)",
              "rgba(255, 0, 0, 1)",
              "rgba(0, 0, 255, 1)",
              "rgba(226, 226, 7, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      optionsThree: {
        animation: {
          duration: 0,
        },
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Tickets By Status",
          },
        },
      },
      chartDataFour: {
        labels: [],
        datasets: [
          {
            label: "Ticket Assigned To Me",
            data: [],
            backgroundColor: [
              "rgba(0, 255, 0, 0.5)",
              "rgba(255, 73, 0, 0.5)",
              "rgba(255, 0, 0, 0.5)",
              "rgba(0, 0, 255, 0.5)",
              "rgba(226, 226, 7, 0.5)",
            ],
            borderColor: [
              "rgba(0, 255, 0, 1)",
              "rgba(255, 73, 0, 1)",
              "rgba(255, 0, 0, 1)",
              "rgba(0, 0, 255, 1)",
              "rgba(226, 226, 7, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      optionsFour: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    };
    this.idleTimer = null;
    this.onAction = this._onAction.bind(this);
    this.onActive = this._onActive.bind(this);
    this.onIdle = this._onIdle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  _onAction(e) {
    // console.log("user did something", e);
    this.setState({ isTimedOut: false });
  }

  _onActive(e) {
    // console.log("user is active", e);
    this.setState({ isTimedOut: false });
  }

  _onIdle(e) {
    // console.log("user is idle", e);
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
    // this.props.history.push("/");
  }

  fetchInfo = () => {
    fetch("https://murmuring-mountain-40437.herokuapp.com/bugs").then(
      (response) =>
        response.json().then((bugs) => {
          console.log(bugs);
          let dataByBugType = [];
          let dataByPriority = [];
          let dataByStatus = [];
          this.setState({ bugs: bugs });
          dataByBugType.push(this.filterBugsByType("Bug/Errors").length);
          dataByBugType.push(this.filterBugsByType("Feature Requests").length);
          dataByBugType.push(this.filterBugsByType("Other Comment").length);
          dataByBugType.push(
            this.filterBugsByType("Training/Document Request").length
          );
          dataByBugType.push(
            this.filterBugsByType("Additional Info Required").length
          );
          dataByStatus.push(this.filterBugsByStatus("New").length);
          dataByStatus.push(this.filterBugsByStatus("Open").length);
          dataByStatus.push(this.filterBugsByStatus("In Progress").length);
          dataByStatus.push(this.filterBugsByStatus("Resolved").length);
          dataByStatus.push(
            this.filterBugsByType("Additional Info Required").length
          );
          // console.log(this.state.bugs[1].details);
          this.setState({ lowCount: this.filterBugs(3) });
          this.setState({ midCount: this.filterBugs(2) });
          this.setState({ highCount: this.filterBugs(1) });
          // console.log(this.filterBugs(3).length);
          dataByPriority.push(this.filterBugs(3).length);
          dataByPriority.push(this.filterBugs(2).length);
          dataByPriority.push(this.filterBugs(1).length);
          console.log(this.state.lowCount);
          console.log(this.state.midCount);
          console.log(this.state.highCount);
          this.setState({
            chartData: {
              datasets: [{ data: dataByPriority, label: "Ticket By Priority" }],
            },
          });
          this.setState({
            chartDataTwo: {
              datasets: [{ data: dataByBugType, label: "Ticket By Type" }],
            },
          });
          this.setState({
            chartDataThree: {
              datasets: [{ data: dataByStatus, label: "Ticket By Status" }],
            },
          });
        })
    );
    fetch(
      `https://murmuring-mountain-40437.herokuapp.com/profile/${this.props.id}`
    ).then((response) =>
      response.json().then((userProfile) => {
        console.log(userProfile);
        let bugAssignedToMe = [];
        let bugSubmitters = [];
        this.setState({ user: userProfile });
        console.log(this.state.user);
        let filteredBugs = this.state.bugs.filter(
          (bug) => bug.assigned == this.state.user.name
        );
        console.log(filteredBugs);
        this.setState({ myBugs: filteredBugs });
        filteredBugs.map((bug) => {
          if (!bugSubmitters.includes(bug.creator)) {
            bugSubmitters.push(bug.creator);
          }
        });
        for (let i = 0; i < bugSubmitters.length; i++) {
          let submitter = bugSubmitters[i];
          let count = 0;
          for (let i = 0; i < filteredBugs.length; i++) {
            if (submitter == filteredBugs[i].creator) {
              count += 1;
            }
          }
          bugAssignedToMe.push(count);
        }

        // if (bugAssignedToMe.length == 0) {
        //   bugAssignedToMe.push(
        //     this.filterBugsAssignedToMe(bug.assigned).length
        //   );
        // }
        console.log(bugAssignedToMe);
        console.log(bugSubmitters);
        this.setState({
          chartDataFour: {
            datasets: [
              { data: bugAssignedToMe, label: "Ticket Assigned To Me" },
            ],
            labels: bugSubmitters,
          },
        });
        this.setState({
          optionsFour: {
            animation: {
              duration: 0,
            },
            plugins: {
              title: {
                display: true,
                text: `${filteredBugs.length} Tickets Assigned to ${this.state.user.name}`,
              },
            },
            labels: bugSubmitters,
          },
        });
      })
    );
  };

  componentDidMount = () => {
    this.fetchInfo();
    console.log(this.props.id);
    console.log(this.state.id);
  };

  filterBugs = (priority) => {
    return this.state.bugs.filter((bug) => {
      return bug.priority == priority;
    });
  };

  filterBugsByType = (bugType) => {
    return this.state.bugs.filter((bug) => {
      return bug.type == bugType;
    });
  };
  filterBugsByStatus = (bugStatus) => {
    return this.state.bugs.filter((bug) => {
      return bug.status == bugStatus;
    });
  };

  redirect = () => {
    this.props.history.push("./viewbugs");
  };

  render() {
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
          debounce={250}
          timeout={this.state.timeout}
        />
        <div className="dashboardLayout">
          {this.state.user.role == "Administrator" && (
            <>
              {" "}
              <SideBar handleLogout={this.handleLogout} page="dashboard" />
            </>
          )}
          {this.state.user.role == "Submitter" && (
            <>
              {" "}
              <SideBarSubmitter
                handleLogout={this.handleLogout}
                page="dashboard"
              />
            </>
          )}
          {this.state.user.role == "Developer" && (
            <>
              {" "}
              <SideBarStandard
                handleLogout={this.handleLogout}
                page="dashboard"
              />
            </>
          )}
          {this.state.user.role == "Project Manager" && (
            <>
              {" "}
              <SideBarProjectManager
                handleLogout={this.handleLogout}
                page="dashboard"
              />
            </>
          )}
          <div className="page-container height">
            <div className="header effect9 dashboard-header">
              <Header
                user={this.state.user}
                handleLogout={this.handleLogout}
                page="dashboard"
              />
            </div>
            <div className="chart-grid">
              <div className="chart">
                <Bar
                  width={20}
                  height={20}
                  data={this.state.chartData}
                  options={this.state.options}
                />
              </div>
              <div className="chart">
                <Doughnut
                  width={20}
                  height={20}
                  data={this.state.chartDataTwo}
                  options={this.state.optionsTwo}
                />
              </div>
              <div className="chart">
                <Bar
                  width={20}
                  height={20}
                  data={this.state.chartDataThree}
                  options={this.state.optionsThree}
                />
              </div>
              <div className="chart">
                <Doughnut
                  width={20}
                  height={20}
                  data={this.state.chartDataFour}
                  options={this.state.optionsFour}
                />
              </div>
              {/* <Card
              Priority="1"
              count={this.state.highCount.length}
              clicked={this.redirect}
            />
            <Card
              Priority="2"
              count={this.state.midCount.length}
              clicked={this.redirect}
            />
            <Card
              Priority="3"
              count={this.state.lowCount.length}
              clicked={this.redirect}
            /> */}

              <IdleTimeOutModal
                showModal={this.state.showModal}
                handleClose={this.handleClose}
                handleLogout={this.handleLogout}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Dashboard);
