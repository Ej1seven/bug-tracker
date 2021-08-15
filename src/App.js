import React, { useState } from "react";
import Login from "./Pages/Login/login";
import Dashboard from "./Pages/Dashboard/dashboard";
import CreateBug from "./Components/Bug Create/bugForm";
import ViewBugPage from "./Pages/ViewBugs/viewBugs";
import MyBugs from "./Pages/MyBugs/mybugs";
import MyProjects from "./Pages/MyProjects/myProjects";
import RoleAssignment from "./Pages/RoleAssignment/roleAssignment";
import MyProfile from "./Pages/MyProfile/myProfile";
import { withRouter } from "react-router";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userIsLoggedIn: false,
      id: null,
    };
  }

  componentDidMount = () => {
    let isUserLogin = localStorage.getItem("userIsLoggedIn");
    let userId = localStorage.getItem("id");
    console.log(isUserLogin);
    console.log(userId);
    if (isUserLogin) {
      this.setState({ userIsLoggedIn: true });
      this.setState({ id: userId });
    }
  };

  logInUser = (id) => {
    this.setState({ id: id });
    this.setState({ userIsLoggedIn: true });
    localStorage.setItem("userIsLoggedIn", this.state.userIsLoggedIn);
    localStorage.setItem("id", this.state.id);
  };

  keepUserLoggedIn = () => {
    this.setState({ userIsLoggedIn: true });
  };

  logUserOut = () => {
    this.setState({ id: null });
    this.setState({ userIsLoggedIn: false });
    localStorage.removeItem("userIsLoggedIn");
    localStorage.removeItem("id");
  };

  isUserLoggedIn = () => {};

  render() {
    return (
      <div>
        <Router>
          {!this.state.userIsLoggedIn ? (
            <Login
              id={this.state.id}
              logInUser={this.logInUser}
              keepUserLoggedIn={this.keepUserLoggedIn}
              userLoginState={this.state.userIsLoggedIn}
              logUserOut={this.logUserOut}
            />
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
