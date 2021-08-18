import React from "react";
import Guest from "../../Components/GuestSignIn/guest";
import PopUp from "../../Components/Popup/popup";
import Dashboard from "../Dashboard/dashboard";
import SideBar from "../../Components/Sidebar/sidebar";
import logo from "./bugTrackerWhite.png";
import "./login.css";
import { withRouter } from "react-router";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/TextField";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const closeBtn = document.getElementsByClassName("close-btn");
console.log(closeBtn);

const styles = {
  underline: {
    borderBottom: "1px solid white",
  },
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seen: false,
      guestseen: false,
      formInput: {
        email: "",
        password: "",
      },
      incorrectPassword: false,
      userIsRegistered: false,
      passwordValues: {
        password: "",
        showPassword: false,
      },
    };
  }

  redirect = () => {
    this.props.history.push("/");
  };

  guestSignIn = () => {
    this.setState({
      guestseen: !this.state.guestseen,
    });
  };

  onSeenChange = () => {
    this.setState({
      seen: !this.state.seen,
    });
  };

  inputChanged = (e) => {
    let formInput = { ...this.state.formInput };
    let passwordValues = { ...this.state.passwordValues };
    formInput[e.target.name] = e.target.value;
    this.setState({ formInput });
    passwordValues["password"] = e.target.value;
    this.setState({ passwordValues });
    console.log("email", JSON.stringify(formInput.email));
    console.log("password", JSON.stringify(formInput.password));
  };

  goBackToDashboard = () => {
    this.setState({ seen: false });
    this.setState({ guestseen: false });
  };

  // togglePop = () => {
  //   this.setState({
  //     seen: !this.seen,
  //   });
  // };

  handleClickShowPassword = () => {
    let showPasswordValues = { ...this.state.passwordValues };

    this.setState({
      passwordValues: {
        showPassword: !this.state.passwordValues.showPassword,
      },
    });

    if (this.state.passwordValues.showPassword == false) {
      document.getElementById("password").type = "text";
    } else {
      document.getElementById("password").type = "password";
    }

    console.log(showPasswordValues);
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  submit = (e) => {
    if (
      this.state.formInput.email === "" ||
      this.state.formInput.password === ""
    ) {
      alert("Please insert your email and password");
    } else {
      fetch("https://murmuring-mountain-40437.herokuapp.com/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.state.formInput.email,
          password: this.state.formInput.password,
        }),
      })
        .then((response) => response.json())
        .then((user) => {
          if (user.id) {
            console.log("this worked!");
            console.log(user.id);
            console.log(user.role);
            this.props.logInUser(user.id);
            // this.setState({ userIsRegistered: true });
            // localStorage.setItem("user", this.state.userIsRegistered);
            this.redirect();
          } else {
            this.setState({ incorrectPassword: true });
          }
        });
      e.preventDefault();
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div className="loginBG">
        {this.state.guestseen ? (
          <div>
            <Guest
              goBackToDashboard={this.goBackToDashboard}
              logInUser={this.props.logInUser}
            ></Guest>
          </div>
        ) : (
          <>
            {this.state.seen ? (
              <div>
                <PopUp
                  goBackToDashboard={this.goBackToDashboard}
                  onSeenChange={this.onSeenChange}
                />
              </div>
            ) : (
              <form id="login-form" className="login-panel">
                <img alt="logo" src={logo} />
                <InputBase
                  name="email"
                  placeholder="Email"
                  onChange={this.inputChanged}
                  value={this.state.formInput.email}
                  InputProps={{ disableUnderline: true }}
                  className={classes.underline}
                />
                <InputBase
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={this.inputChanged}
                  value={this.state.formInput.password}
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={this.handleClickShowPassword}
                          onMouseDown={this.handleMouseDownPassword}
                        >
                          {this.state.passwordValues.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  className={classes.underline}
                />
                <div className="form-buttons-contatiner">
                  {" "}
                  {this.state.incorrectPassword === true ? (
                    <div className="error-message">
                      <span> Incorrect name or password </span>
                    </div>
                  ) : null}
                  <Button
                    type="submit"
                    className="submit-button"
                    onClick={this.submit}
                  >
                    {" "}
                    Login{" "}
                  </Button>{" "}
                  <p>
                    Don't have an account?{" "}
                    <span className="sign-up" onClick={this.onSeenChange}>
                      Sign up
                    </span>
                  </p>
                  <p>
                    Sign in as a{" "}
                    <span className="sign-up" onClick={this.guestSignIn}>
                      Demo User
                    </span>
                  </p>
                </div>
              </form>
            )}{" "}
          </>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(Login));
