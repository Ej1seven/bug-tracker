import React from "react";
//Importing the SideBar components according the role assigned to the user
import SideBar from "../../Components/Sidebar/sidebar";
import SideBarSubmitter from "../../Components/Sidebar/sidebarSubmitter";
import SideBarStandard from "../../Components/Sidebar/sidebarStandard";
import SideBarProjectManager from "../../Components/Sidebar/sidebarProjectManager";
import MyProfileSection from "./components/myProfileSection";
import "./myProfile.css";
//Importing IdleTimer which is used to notify the user when their webpage has been inactive for 2 minutes
import IdleTimer from "react-idle-timer";
//Importing IdleTimeOutModal which is the popup modal that displays a prompt asking the user if they would like to remain logged in or not
import { IdleTimeOutModal } from "../../Components/IdleTimeOutModal/IdleTimeOutModal";
//Importing withRouter from react-router which passes updated match, location, and history props to the Login component
import { withRouter } from "react-router-dom";
//Importing Material UI components
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bugs: [],
      user: {},
      users: [],
      projects: [],
      editMode: false,
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
    console.log(this.props.userLoginState);
    this.props.history.push("/");
  }
  //During the mounting phase of the React Life-cycle the Dashboard component fetches data from the database
  componentDidMount = () => {
    this.fetchInfo();
  };
  //fetches ticket data and the user's profile data from the heroku database
  fetchInfo = () => {
    //fetches the active user's profile from the database by using the user's unique id
    fetch(
      `https://murmuring-mountain-40437.herokuapp.com/profile/${this.props.id}`
    ).then((response) =>
      response.json().then((userProfile) => {
        this.setState({ user: userProfile });
      })
    );
  };

  editClicked = () => {
    this.setState({ editMode: !this.state.editMode });
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
              <SideBarProjectManager handleLogout={this.handleLogout} />
            </>
          )}{" "}
          <div className="myprofile-page">
            <div className="header">
              <h1>User Information</h1>
            </div>
            <div className="user-information-container">
              <div className="information-grid">
                <div className="information-item">
                  <MyProfileSection
                    info={this.state.user.name}
                    editClicked={this.editClicked}
                    edit={this.state.editMode}
                    title="Name"
                    name="name"
                  ></MyProfileSection>
                </div>
                <div className="information-item">
                  <MyProfileSection
                    info={this.state.user.email}
                    editClicked={this.editClicked}
                    edit={this.state.editMode}
                    title="Email"
                    name="email"
                  ></MyProfileSection>
                </div>
                <div className="information-item">
                  <MyProfileSection
                    info={this.state.user.role}
                    editClicked={this.editClicked}
                    edit={this.state.editMode}
                    title="Role"
                    name="role"
                  ></MyProfileSection>
                </div>
                <div className="information-item">
                  {" "}
                  <MyProfileSection
                    info={this.state.user.joined}
                    editClicked={this.editClicked}
                    edit={this.state.editMode}
                    title="Joined"
                    name="joined"
                  ></MyProfileSection>
                </div>
                <Link to="/" className="back-to-dashboard">
                  <Button className="button-text ">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(MyProfile);
