import React from "react";
//Importing Guest component used for guest login
import Guest from "../../Components/GuestSignIn/guest";
//Importing Popup component used for registering new users
import PopUp from "../../Components/Popup/popup";
import logo from "./bugTrackerWhite.png";
import "./login.css";
//Importing withRouter from react-router which passes updated match, location, and history props to the Login component
import { withRouter } from "react-router";
//Importing Material UI components
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/TextField";
// withStyles allows for custom styling of Material UI components
import { withStyles } from "@material-ui/core/styles";
// InputAdornment provides the functionality to show/hide passwords when clicking on the eye icon
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
//Visibility on and off shows/hides the password when the eye icon is clicked
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

document.querySelector("html").classList.remove("background");
//styles the input fields imported from Material UI with a white underline
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
      showPassword: false,
    };
  }
  //redirect function uses the history prop passed down from withRouter to send the user back to the login page
  redirect = () => {
    this.props.history.push("/");
  };
  //toggles the Guest sign in component
  guestSignIn = () => {
    this.setState({
      guestseen: !this.state.guestseen,
    });
  };
  //toggles the register component
  onSeenChange = () => {
    this.setState({
      seen: !this.state.seen,
    });
  };
  //takes the user's email and password input from the login form
  //and attaches the value to the email and password property in state
  inputChanged = (e) => {
    let formInput = { ...this.state.formInput };
    formInput[e.target.name] = e.target.value;
    this.setState({ formInput });
  };
  //goBackToDashboard function send the user back to the login form
  //by setting the register and guest components to false
  goBackToDashboard = () => {
    this.setState({ seen: false });
    this.setState({ guestseen: false });
  };
  //handleClickShowPassword shows or hides the password field depending on state
  //of the showPassword property in state
  handleClickShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
    this.state.showPassword === false
      ? (document.getElementById("password").type = "text")
      : (document.getElementById("password").type = "password");
  };
  //handleMouseDownPassword function prevents the click event from occurring until the user releases the mouse button
  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  //submit function fires once the login button is pressed
  submit = (e) => {
    //if the email or password fields are left blank on the login form a alert message prompts
    //otherwise the email and password values are passed to the heroku database to be verified
    this.state.formInput.email === "" || this.state.formInput.password === ""
      ? alert("Please insert your email and password")
      : fetch("https://murmuring-mountain-40437.herokuapp.com/login", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.state.formInput.email,
            password: this.state.formInput.password,
          }),
        })
          .then((response) => response.json())
          .then((user) => {
            //if the user's login credential are verified then the database responds with the user's id and the user is redirected to the Dashboard component
            //otherwise the incorrect password property is set to true and the error message div displays
            if (user.id) {
              this.props.logInUser(user.id);
              this.redirect();
            } else {
              this.setState({ incorrectPassword: true });
            }
          });
    e.preventDefault();
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
                          {this.state.showPassword ? (
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
