import React from "react";
import Dashboard from "../../Pages/Dashboard/dashboard";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const styles = {
  underline: {
    borderBottom: "1px solid white",
    width: "70%",
  },
};

class Guest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: null,
    };
  }

  inputChanged = (e) => {
    e.preventDefault();
    let formInput = { ...this.state.formInput };
    let passwordValues = { ...this.state.passwordValues };
    let confirmPasswordValues = { ...this.state.confirmPasswordValues };

    formInput[e.target.name] = e.target.value;
    this.setState({
      formInput,
    });
    passwordValues["password"] = e.target.value;
    this.setState({ passwordValues });
    confirmPasswordValues["password"] = e.target.value;
    this.setState({ confirmPasswordValues });

    console.log("email", JSON.stringify(formInput.email));
    console.log("password", JSON.stringify(formInput.password));
    console.log("name", JSON.stringify(formInput.name));
    console.log("confirmpassword", JSON.stringify(formInput.confirmpassword));
  };

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

  handleClickShowPasswordTwo = () => {
    let showPasswordValues = { ...this.state.confirmPasswordValues };

    this.setState({
      confirmPasswordValues: {
        showPassword: !this.state.confirmPasswordValues.showPassword,
      },
    });

    if (this.state.confirmPasswordValues.showPassword == false) {
      document.getElementById("confirmpassword").type = "text";
    } else {
      document.getElementById("confirmpassword").type = "password";
    }

    console.log(showPasswordValues);
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  submit = (e) => {
    if (this.state.formInput.name === "") {
      alert("Please insert name");
    } else if (this.state.formInput.email === "") {
      alert("Please insert a valid email address");
    } else if (this.state.formInput.password === "") {
      alert("Please insert password");
    } else if (
      this.state.formInput.confirmpassword !== this.state.formInput.password
    ) {
      this.setState({ incorrectPassword: true });
    } else {
      fetch("https://murmuring-mountain-40437.herokuapp.com/register", {
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
          if (user.id) {
            console.log("register is working!");
            this.props.goBackToDashboard();
            alert("You are now registered! Please login!");
            // this.setState({ userIsRegistered: true });
          } else {
            this.setState({ incorrectPassword: true });
          }
        })
      );
    }
    e.preventDefault();
  };

  // function submit(e) {

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
                      {this.state.confirmPasswordValues.showPassword ? (
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
              {this.incorrectPassword === true ? (
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

export default withStyles(styles)(Guest);
