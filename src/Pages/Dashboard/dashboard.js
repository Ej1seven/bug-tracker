import React from "react";
//Importing the SideBar components according the role assigned to the user
import SideBar from "../../Components/Sidebar/sidebar";
import SideBarSubmitter from "../../Components/Sidebar/sidebarSubmitter";
import SideBarStandard from "../../Components/Sidebar/sidebarStandard";
import SideBarProjectManager from "../../Components/Sidebar/sidebarProjectManager";
//Importing charts used to display user data from react-chartjs
import { Bar, Doughnut } from "react-chartjs-2";
//Importing Header which displays the users name, role and user profile information
import Header from "../../Components/Header/header";
import "./dashboard.css";
//Importing IdleTimer which is used to notify the user when their webpage has been inactive for 2 minutes
import IdleTimer from "react-idle-timer";
//Importing IdleTimeOutModal which is the popup modal that displays a prompt asking the user if they would like to remain logged in or not
import { IdleTimeOutModal } from "../../Components/IdleTimeOutModal/IdleTimeOutModal";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      bugs: {},
      myBugs: [],
      user: {},
      timeout: 1000 * 5 * 24,
      isTimedOut: false,
      showModal: false,
      //The data imported into the "Tickets By Priorty" chart used by react-chartjs
      chartData: {
        //Each label is shown below each bar on the graph
        labels: ["Low", "Medium", "High"],
        //datasets refers to the information imported into the bar graph
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
      //The data imported into the "Tickets By Type" chart used by react-chartjs
      chartDataTwo: {
        //Each label is represented as a portion on the doughnut graph
        labels: [
          "Bug/Errors",
          "Feature Requests",
          "Other Comments",
          "Training/Document Request",
          "Additional Info Required",
        ],
        //datasets refers to the information imported into the doughnut graph
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
      //The data imported into the "Tickets By Status" chart used by react-chartjs
      chartDataThree: {
        //Each label is shown below each bar on the graph
        labels: [
          "New",
          "Open",
          "In Progress",
          "Resolved",
          "Additional Info Required",
        ],
        //datasets refers to the information imported into the bar graph
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
      //The data imported into the "Ticket Assigned To Me" chart used by react-chartjs
      chartDataFour: {
        //The chart labels are dynamic depending on the data pulled from the database on this doughnut chart
        labels: [],
        //datasets refers to the information imported into the doughnut graph
        datasets: [
          {
            label: "Tickets Assigned To Me",
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
        //Responsive chart adjust to the size of the screen
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
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
    this.setState({ isTimedOut: false });
  }
  //user is active
  _onActive(e) {
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
  //During the mounting phase of the React Life-cycle the Dashboard component fetches data from the database
  componentDidMount = () => {
    this.fetchInfo();
  };
  //fetches ticket data and the user's profile data from the heroku database
  fetchInfo = () => {
    fetch("https://murmuring-mountain-40437.herokuapp.com/bugs").then(
      (response) =>
        response.json().then((bugs) => {
          //pulls all the tickets from the bugs table in the database then filters the tickets into the empty array variables listed below
          //this data will be imported into the react charts
          let dataByBugType = [];
          let dataByPriority = [];
          let dataByStatus = [];
          this.setState({ bugs: bugs });
          //uses the filterBugsByType function to filter the tickets according to the ticket's type then pushes the number counted
          //of each bug type into the dataByBugType array
          dataByBugType.push(this.filterBugsByType("Bug/Errors").length);
          dataByBugType.push(this.filterBugsByType("Feature Requests").length);
          dataByBugType.push(this.filterBugsByType("Other Comment").length);
          dataByBugType.push(
            this.filterBugsByType("Training/Document Request").length
          );
          dataByBugType.push(
            this.filterBugsByType("Additional Info Required").length
          );
          //uses the filterBugsByStatus function to filter the tickets according to the ticket's status then pushes the number counted
          //of each bug type by status into the dataByStatus array
          dataByStatus.push(this.filterBugsByStatus("New").length);
          dataByStatus.push(this.filterBugsByStatus("Open").length);
          dataByStatus.push(this.filterBugsByStatus("In Progress").length);
          dataByStatus.push(this.filterBugsByStatus("Resolved").length);
          dataByStatus.push(
            this.filterBugsByType("Additional Info Required").length
          );
          //uses the filterBugs function to filter the tickets according to the ticket's priority (1 = High, 2 = Medium, 3 = Low) then pushes the number counted
          //of each bug type by priority into the dataByPriority array
          dataByPriority.push(this.filterBugs(3).length);
          dataByPriority.push(this.filterBugs(2).length);
          dataByPriority.push(this.filterBugs(1).length);
          //imports the filtered data pulled from the database into the react charts
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
    //fetches the active users profile from the database by using the users unique id
    fetch(
      `https://murmuring-mountain-40437.herokuapp.com/profile/${this.props.id}`
    ).then((response) =>
      response.json().then((userProfile) => {
        let bugAssignedToMe = [];
        let bugSubmitters = [];
        this.setState({ user: userProfile });
        //filters out all the tickets assigned to the user
        let filteredBugs = this.state.bugs.filter(
          (bug) => bug.assigned == this.state.user.name
        );
        this.setState({ myBugs: filteredBugs });
        //filters out the creators of all the tickets assigned to the user
        filteredBugs.map((bug) => {
          if (!bugSubmitters.includes(bug.creator)) {
            bugSubmitters.push(bug.creator);
          }
        });
        //counts all the tickets assigned to the user then adds the count to the bugAssignedToMe array
        for (let i = 0; i < bugSubmitters.length; i++) {
          let submitter = bugSubmitters[i];
          let count = 0;
          for (let i = 0; i < filteredBugs.length; i++) {
            if (submitter === filteredBugs[i].creator) {
              count += 1;
            }
          }
          bugAssignedToMe.push(count);
        }
        //imports the filtered data pulled from the database into the "Ticket Assigned To Me" react chart
        this.setState({
          chartDataFour: {
            datasets: [
              { data: bugAssignedToMe, label: "Tickets Assigned To Me" },
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
  //this function filters the bugs by priority
  filterBugs = (priority) => {
    return this.state.bugs.filter((bug) => {
      return bug.priority == priority;
    });
  };
  //this function filters the bugs by type
  filterBugsByType = (bugType) => {
    return this.state.bugs.filter((bug) => {
      return bug.type == bugType;
    });
  };
  //this function filters the bugs by status
  filterBugsByStatus = (bugStatus) => {
    return this.state.bugs.filter((bug) => {
      return bug.status == bugStatus;
    });
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

export default Dashboard;
