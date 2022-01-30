import React, { useState, useEffect } from "react";
import "./bugViewSection.css";

const BugViewSection = (props) => {
  const [fieldDisabled, setFieldDisabled] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [canEditProject, setCanEditProject] = useState(false);
  const [canEditTicketStatus, setCanEditTicketStatus] = useState(false);
  const [canEditTicketType, setCanEditTicketType] = useState(false);

  useEffect(() => {
    if (props.name == "creator") {
      setFieldDisabled(true);
    }
    if (
      props.name == "assigned" &&
      (props.user == "Administrator" || props.user == "Submitter")
    ) {
      setHasPermissions(true);
    } else if (props.name == "assigned") {
      setFieldDisabled(true);
    }
    if (
      props.name == "project" &&
      (props.user == "Administrator" || props.user == "Project Manager")
    ) {
      setCanEditProject(true);
    } else if (props.name == "project") {
      setFieldDisabled(true);
    }
    if (
      props.name == "status" &&
      (props.user == "Administrator" || props.user == "Developer")
    ) {
      setCanEditTicketStatus(true);
    } else if (props.name == "status") {
      setFieldDisabled(true);
    }
    if (props.name == "type") {
      setCanEditTicketType(true);
    }
  }, []);
  return (
    <div
      className={
        props.title == "Description"
          ? "description-section-bugview"
          : "view-section"
      }
    >
      <h2>{props.title}</h2>
      {!props.edit ? (
        <p>{props.info}</p>
      ) : props.name !== "priority" ? (
        hasPermissions ? (
          <>
            <select
              name={props.name}
              onChange={props.editedField}
              placeholder={props.info}
              onfocus=""
            >
              <option>{props.info}</option>
              {props.users.map((user) => {
                if (user.name !== props.info) {
                  return <option value={user.name}>{user.name}</option>;
                }
              })}
            </select>
          </>
        ) : canEditProject ? (
          <>
            <select
              name={props.name}
              onChange={props.editedField}
              placeholder={props.info}
              onfocus=""
            >
              <option>{props.info}</option>
              {props.projects.map((project) => {
                if (project.name !== props.info) {
                  return <option value={project.name}>{project.name}</option>;
                }
              })}
            </select>
          </>
        ) : canEditTicketStatus ? (
          <>
            <select
              name={props.name}
              onChange={props.editedField}
              placeholder={props.info}
              onfocus=""
            >
              <option>{props.info}</option>
              {props.info !== "New" ? <option value="New">New</option> : null}
              {props.info !== "Open" ? (
                <option value="Open">Open</option>
              ) : null}
              {props.info !== "In Progress" ? (
                <option value="In Progress">In Progress</option>
              ) : null}
              {props.info !== "Resolved" ? (
                <option value="Resolved">Resolved</option>
              ) : null}
              {props.info !== "Additional Info Required" ? (
                <option value="Additional Info Required">
                  Additional Info Required
                </option>
              ) : null}
              {props.info !== "Closed" ? (
                <option value="Closed">Closed</option>
              ) : null}
            </select>
          </>
        ) : canEditTicketType ? (
          <>
            {" "}
            <select
              name={props.name}
              onChange={props.editedField}
              placeholder={props.info}
              onfocus=""
            >
              <option>{props.info}</option>
              {props.info !== "Bug/Errors" ? (
                <option value="Bug/Errors">Bug/Errors</option>
              ) : null}
              {props.info !== "Open" ? (
                <option value="Open">Feature Requests</option>
              ) : null}
              {props.info !== "In Progress" ? (
                <option value="In Progress">Other Comments</option>
              ) : null}
              {props.info !== "Resolved" ? (
                <option value="Resolved">Training/Document Request</option>
              ) : null}
              {props.info !== "Additional Info Required" ? (
                <option value="Additional Info Required">
                  Additional Info Required
                </option>
              ) : null}
            </select>
          </>
        ) : (
          <>
            <textarea
              className={`bug-input`}
              onfocus=""
              placeholder={props.info}
              defaultValue={props.info}
              onChange={props.editedField}
              name={props.name}
              disabled={fieldDisabled}
            ></textarea>
          </>
        )
      ) : (
        <select
          name={props.name}
          onChange={props.editedField}
          placeholder={props.info}
          onfocus=""
        >
          <option>{props.info}</option>
          {props.info !== "High" ? <option value="High">High</option> : null}
          {props.info !== "Medium" ? <option value="Medium">Mid</option> : null}
          {props.info !== "Low" ? <option value="Low">Low</option> : null}
        </select>
      )}
    </div>
  );
};

export default BugViewSection;
