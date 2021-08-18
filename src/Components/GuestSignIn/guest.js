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

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

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
      email: "",
      password: "",
    };
  }

  // redirect = () => {
  //   this.props.history.push("/");
  // };

  inputChanged = (email, password) => {
    this.setState({ email: email });
    this.setState({ password: password });
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
    console.log(this.state.email);
    console.log(this.state.password);

    if (this.state.email == "") {
      alert("Please select a role before clicking button");
    }

    fetch("https://murmuring-mountain-40437.herokuapp.com/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
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
          // this.redirect();
        }
      });

    e.preventDefault();
  };

  // function submit(e) {

  render() {
    const { classes } = this.props;

    return (
      <div className="login-panel" id="guest-panel">
        <div className="guest-btn-container">
          <List>
            <ListItem
              onClick={() =>
                this.inputChanged("administrator@gmail.com", "administrator")
              }
            >
              <Button>Administator</Button>
            </ListItem>
            <ListItem
              onClick={() =>
                this.inputChanged("projectmanager@gmail.com", "projectmanager")
              }
            >
              <Button>Project Manager</Button>
            </ListItem>
            <ListItem
              onClick={() =>
                this.inputChanged("submitter@gmail.com", "submitter")
              }
            >
              <Button>Submitter</Button>
            </ListItem>
            <ListItem
              onClick={() =>
                this.inputChanged("developer@gmail.com", "developer")
              }
            >
              <Button>Developer</Button>
            </ListItem>
          </List>

          {/* <button>Administator</button>
          <button>Submitter</button>
          <button>Project manager</button>
          <button>Developer</button> */}
        </div>
        <div className="guest-select-btns">
          <Button onClick={this.submit}>Select Role</Button>
          <Button onClick={this.props.goBackToDashboard}>Go Back</Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Guest);
