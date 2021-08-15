import React from "react";
import PopUp from "../../Components/Popup/popup";
import Dashboard from "../Dashboard/dashboard";
import SideBar from "../../Components/Sidebar/sidebar";
import logo from "./UpdatedLogo.png";
import "./login.css";
import { withRouter } from "react-router";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/TextField";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";

const closeBtn = document.getElementsByClassName("close-btn");
console.log(closeBtn);

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seen: false,
      formInput: {
        email: "",
        password: "",
      },
      incorrectPassword: false,
      userIsRegistered: false,
    };
  }

  redirect = () => {
    this.props.history.push("/");
  };

  onSeenChange = () => {
    this.setState({
      seen: !this.state.seen,
    });
  };

  inputChanged = (e) => {
    let formInput = { ...this.state.formInput };
    formInput[e.target.name] = e.target.value;
    this.setState({ formInput });
    console.log("email", JSON.stringify(formInput.email));
    console.log("password", JSON.stringify(formInput.password));
  };

  goBackToDashboard = () => {
    this.setState({ seen: false });
  };

  // togglePop = () => {
  //   this.setState({
  //     seen: !this.seen,
  //   });
  // };

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
        {" "}
        {this.state.seen ? (
          <div onClick={this.onSeenChange} className="close-btn">
            <i class="fas fa-window-close fa-3x"> </i>{" "}
          </div>
        ) : (
          <div className="register-btn" onClick={this.onSeenChange}>
            <button id="register-btn"> Register </button>{" "}
          </div>
        )}{" "}
        {this.state.seen ? (
          <div>
            <PopUp goBackToDashboard={this.goBackToDashboard} />
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
            />
            <InputBase
              name="password"
              type="password"
              placeholder="Password"
              onChange={this.inputChanged}
              value={this.state.formInput.password}
              InputProps={{ disableUnderline: true }}
            />
            <div className="error-message">
              {" "}
              {this.state.incorrectPassword === true ? (
                <span> Incorrect name or password </span>
              ) : (
                <> </>
              )}{" "}
            </div>{" "}
            <Button type="submit" onClick={this.submit}>
              {" "}
              Login{" "}
            </Button>{" "}
          </form>
        )}{" "}
      </div>
    );
  }
}

export default withRouter(Login);
