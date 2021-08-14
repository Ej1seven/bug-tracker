import React from "react";
import Dashboard from "../../Pages/Dashboard/dashboard";
import { Link } from "react-router-dom";

const closeBtn = document.getElementsByClassName("close-btn");

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formInput: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      incorrectPassword: false,
      userIsRegistered: false,
    };
  }

  inputChanged = (e) => {
    e.preventDefault();
    let formInput = { ...this.state.formInput };
    formInput[e.target.name] = e.target.value;
    this.setState({
      formInput,
    });
    console.log("email", JSON.stringify(formInput.email));
    console.log("password", JSON.stringify(formInput.password));
    console.log("name", JSON.stringify(formInput.name));
    console.log("confirmpassword", JSON.stringify(formInput.confirmpassword));
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
    return (
      <div>
        {this.state.userIsRegistered ? (
          <div className="loginBG">
            <Dashboard />
          </div>
        ) : (
          <form className="login-panel">
            <h1>Register</h1>
            <input
              name="name"
              placeholder="Name"
              onChange={this.inputChanged}
              value={this.state.formInput.name}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={this.inputChanged}
              value={this.state.formInput.email}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={this.inputChanged}
              value={this.state.formInput.password}
              required
            />
            <input
              name="confirmpassword"
              type="password"
              placeholder="Confirm Password"
              onChange={this.inputChanged}
              value={this.state.formInput.confirmpassword}
              required
            />
            <div className="error-message">
              {this.incorrectPassword === true ? (
                <span>Passwords do not match!</span>
              ) : (
                <></>
              )}
            </div>
            <button type="submit" onClick={this.submit}>
              Register
            </button>
          </form>
        )}
      </div>
    );
  }
}

export default Popup;
