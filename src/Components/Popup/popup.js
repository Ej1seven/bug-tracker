import React from "react";
//Importing Dashboard page
import Dashboard from "../../Pages/Dashboard/dashboard";
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

//styles the input fields imported from Material UI with a white underline
const styles = {
  underline: {
    borderBottom: "1px solid white",
    width: "70%",
  },
};

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formInput: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Developer",
      },
      incorrectPassword: false,
      userIsRegistered: false,
      showPassword: false,
      showConfirmPassword: false,
    };
  }
  //takes the user's name, email, password, and confirm password inputs from the register form
  //and attaches the values to the name, email, password, and confirm password properties in state
  inputChanged = (e) => {
    e.preventDefault();
    let formInput = { ...this.state.formInput };
    formInput[e.target.name] = e.target.value;
    this.setState({ formInput });
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
  //handleClickShowPasswordTwo shows or hides the password field depending on state
  //of the showConfirmPassword property in state
  handleClickShowPasswordTwo = () => {
    this.setState({
      showConfirmPassword: !this.state.showConfirmPassword,
    });
    this.state.showConfirmPassword === false
      ? (document.getElementById("confirmpassword").type = "text")
      : (document.getElementById("confirmpassword").type = "password");
  };
  //handleMouseDownPassword function prevents the click event from occurring until the user releases the mouse button
  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  //submit function fires once the register button is pressed
  submit = (e) => {
    //if the name, email, password, or confirm password fields are left blank on the register form a alert message prompts
    //otherwise the name, email, and password values are passed to the heroku database to be stored in a new user profile
    //new users are automatically assigned the developer role
    this.state.formInput.name === ""
      ? alert("Please insert name")
      : this.state.formInput.email === ""
      ? alert("Please insert a valid email address")
      : this.state.formInput.password === ""
      ? alert("Please insert password")
      : this.state.formInput.confirmpassword !== this.state.formInput.password
      ? this.setState({ incorrectPassword: true })
      : fetch("https://murmuring-mountain-40437.herokuapp.com/register", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: this.state.formInput.name,
            email: this.state.formInput.email,
            password: this.state.formInput.password,
            role: this.state.formInput.role,
          }),
        }).then((response) =>
          response.json().then((user) => {
            //if the data is successfully stored in the database the user is routed back to the login form to login for the first time
            //otherwise a alert message prompts
            if (user.id) {
              this.props.goBackToDashboard();
              alert("You are now registered! Please login!");
            } else {
              alert("Error occurred, please try again!");
            }
          })
        );
    e.preventDefault();
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.state.userIsRegistered ? (
          <div className="loginBG">
            <Dashboard />
          </div>
        ) : (
          <form className="login-panel">
            <h1>Register</h1>
            <InputBase
              name="name"
              placeholder="Name"
              onChange={this.inputChanged}
              value={this.state.formInput.name}
              required
              InputProps={{ disableUnderline: true }}
              className={classes.underline}
            />
            <InputBase
              name="email"
              type="email"
              placeholder="Email"
              onChange={this.inputChanged}
              value={this.state.formInput.email}
              required
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
              required
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
            <InputBase
              id="confirmpassword"
              name="confirmpassword"
              type="password"
              placeholder="Confirm Password"
              onChange={this.inputChanged}
              value={this.state.formInput.confirmpassword}
              required
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.handleClickShowPasswordTwo}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showConfirmPassword ? (
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
              {this.state.incorrectPassword === true ? (
                <div className="error-message">
                  {" "}
                  <span>Passwords do not match!</span>{" "}
                </div>
              ) : null}

              <Button
                type="submit"
                className="submit-button"
                onClick={this.submit}
              >
                Register
              </Button>
              <p>
                Already have an account?{" "}
                <span className="sign-in" onClick={this.props.onSeenChange}>
                  Sign In
                </span>
              </p>
            </div>
          </form>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Popup);
