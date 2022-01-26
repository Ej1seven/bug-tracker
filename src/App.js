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

  //When this function is ran the id and userIsLoggedIn properties are set to false and removed from local storage
  //This causes the the isUserLogin variable to change to false which in turn cause the application to redirect to the login component
  logUserOut = () => {
    this.setState({ id: null });
    this.setState({ userIsLoggedIn: false });
    localStorage.removeItem("userIsLoggedIn");
    localStorage.removeItem("id");
  };

  render() {
    //This if-else statements sets the background to white if the user is logged in
    // otherwise the background remains the color gradient set in the login.css file
    //I did this to ensure the color gradient background only shows when the Login component is accessed
    !this.state.userIsLoggedIn
      ? document.querySelector("html").classList.remove("background")
      : document.querySelector("html").classList.add("background");

    return (
      <div>
        <Router>
          {
            //The router directs the user to the Login component if the userIsLoggedIn property is set to false
            //Otherwise the router directs the user to dashboard or whichever page they were on before they closed the browser
            !this.state.userIsLoggedIn ? (
              <>
                <Login id={this.state.id} logInUser={this.logInUser} />
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
            )
          }
        </Router>
      </div>
    );
  }
}

export default App;
