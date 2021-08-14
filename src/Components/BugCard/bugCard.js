import React from "react";
import "./bugCard.css";
import PriorityController from "../Card/priorityController";

const BugCard = (props) => {
  const { name, priority, version } = props.bug;
  const { level, color } = PriorityController(priority);

  function Clicked() {
    let bug = {
      name: name,
      id: props.id,
    };
    // console.log(props.bug);
    // console.log(props.id);
    console.log(bug.name);
    console.log(bug.id);

    props.clicked(bug);
  }

  return (
    <div className="bug-card" onClick={Clicked} style={{ color: color }}>
      <h2 className="name">{name}</h2>
      <h4 className="priority">{level}</h4>
      <h5 className="version">{version}</h5>
    </div>
  );
};

export default BugCard;
