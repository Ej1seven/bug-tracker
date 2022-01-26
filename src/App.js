import React from "react";
//Imported page components for react-router-dom
import Login from "./Pages/Login/login";
import Dashboard from "./Pages/Dashboard/dashboard";
import CreateBug from "./Components/Bug Create/bugForm";
import ViewBugPage from "./Pages/ViewBugs/viewBugs";
import MyBugs from "./Pages/MyBugs/mybugs";
import MyProjects from "./Pages/MyProjects/myProjects";
import RoleAssignment from "./Pages/RoleAssignment/roleAssignment";
import MyProfile from "./Pages/MyProfile/myProfile";
//Imported routing components from react-router-dom
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
//Imported styling properties for App.js file
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userIsLoggedIn: false,
      id: null,
    };
  }

  componentDidMount = () => {
    //During the mounting phase of the React Life-cycle the application checks local storage
    // to see if the userIsLoggedIn and id properties are true or false
    let isUserLogin = localStorage.getItem("userIsLoggedIn");
    let userId = localStorage.getItem("id");
    //If userIsLoggedIn is true then the id property is set to the userId value pulled from local storage
    if (isUserLogin) {
      this.setState({ userIsLoggedIn: true });
      this.setState({ id: userId });
    }
  };

  //The logInUser function is passed down to the Login component
  //If the users credentials are validated by the heroku database then the database returns the user's id
  //The user id returned from the database is set to the id property and the userIsLoggedIn property is set to true
  //local storage also sets these values which allows the end user to return to the same page in case the browser is closed.
  logInUser = (id) => {
    this.setState({ id: id });
    this.setState({ userIsLoggedIn: true });
    localStorage.setItem("userIsLoggedIn", this.state.userIsLoggedIn);
    localStorage.setItem("id", this.state.id);
  };

  logUserOut = () => {
    this.setState({ id: null });
    this.setState({ userIsLoggedIn: false });
    localStorage.removeItem("userIsLoggedIn");
    localStorage.removeItem("id");
  };

  isUserLoggedIn = () => {};

  render() {
    if (!this.state.userIsLoggedIn) {
      document.querySelector("html").classList.remove("background");
    } else {
      document.querySelector("html").classList.add("background");
    }
    return (
      <div>
        <Router>
          {!this.state.userIsLoggedIn ? (
            <>
              <Login
                id={this.state.id}
                logInUser={this.logInUser}
                userLoginState={this.state.userIsLoggedIn}
                logUserOut={this.logUserOut}
              />
            </>
          ) : (
            <>
              <Switch>
                <Dashboard
                  path="/"
                  exact
                  id={this.state.id}
                  logUserOut={this.logUserOut}
                  userLoginState={this.state.userIsLoggedIn}
                />
                <Route path="/create">
                  <CreateBug
                    title="Create Ticket"
                    id={this.state.id}
                    logUserOut={this.logUserOut}
                    userLoginState={this.state.userIsLoggedIn}
                  />
                </Route>
                <Route path="/viewbugs">
                  <ViewBugPage
                    id={this.state.id}
                    logUserOut={this.logUserOut}
                    userLoginState={this.state.userIsLoggedIn}
                  />
                </Route>
                <Route path="/mybugs">
                  <MyBugs
                    id={this.state.id}
                    logUserOut={this.logUserOut}
                    userLoginState={this.state.userIsLoggedIn}
                  />
                </Route>
                <Route path="/myprojects">
                  <MyProjects
                    id={this.state.id}
                    logUserOut={this.logUserOut}
                    userLoginState={this.state.userIsLoggedIn}
                  />
                </Route>
                <Route path="/userroles">
                  <RoleAssignment
                    id={this.state.id}
                    logUserOut={this.logUserOut}
                    userLoginState={this.state.userIsLoggedIn}
                  />
                </Route>
                <Route path="/myprofile">
                  <MyProfile
                    id={this.state.id}
                    logUserOut={this.logUserOut}
                    userLoginState={this.state.userIsLoggedIn}
                  />
                </Route>
              </Switch>
            </>
          )}
        </Router>
      </div>
    );
  }
}

export default App;
