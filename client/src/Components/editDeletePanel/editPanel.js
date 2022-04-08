import React from "react";
import { Link } from "react-router-dom";
import "./editPanel.css";

const EditPanel = (props) => {
  return (
    <div className="edit-panel">
      {props.user == "Administrator" ? (
        <>
          <button onClick={props.deleteClicked}>
            <Link className="link" to="/viewBugs">
              Delete
            </Link>
          </button>
        </>
      ) : null}

      <button className="edit" onClick={props.editClicked}>
        Edit
      </button>
      {props.edit ? (
        <button onClick={props.submitClicked}>Submit</button>
      ) : (
        <></>
      )}
      <button onClick={props.commentsClicked}>Comments</button>
      <button onClick={props.historyClicked}>History</button>
      <button onClick={props.close}>Close</button>
    </div>
  );
};

export default EditPanel;
