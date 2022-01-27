import React from "react";
//Importing Material UI components
import Button from "@material-ui/core/Button";
// withStyles allows for custom styling of Material UI components
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
class Guest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }
  //Depending on the button clicked the email and password properties will the filled with the selected roles information
  inputChanged = (email, password) => {
    this.setState({ email: email });
    this.setState({ password: password });
  };
  //submit function fires once the login button is pressed
  submit = (e) => {
    //if none of the roles are selected and the select role button is clicked a alert message will prompt
    this.state.email === ""
      ? alert("Please select a role before clicking button")
      : fetch("https://murmuring-mountain-40437.herokuapp.com/login", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
          }),
        })
          .then((response) => response.json())
          .then((user) => {
            //if the user's login credential are verified then the database responds with the user's id and the user is redirected to the Dashboard component
            if (user.id) {
              this.props.logInUser(user.id);
            }
          });
    e.preventDefault();
  };

  render() {
    return (
      <div className="login-panel" id="guest-panel">
        <div className="guest-btn-container">
          <List>
            <ListItem
              onClick={() =>
                this.inputChanged("administrator@gmail.com", "administrator")
              }
            >
              <Button>Administrator</Button>
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
        </div>
        <div className="guest-select-btns">
          <Button onClick={this.submit}>Select Role</Button>
          <Button onClick={this.props.goBackToDashboard}>Go Back</Button>
        </div>
      </div>
    );
  }
}

export default Guest;
