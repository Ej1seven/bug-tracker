import React from "react";
import "./card.css";
import Priority from "./priorityController";

const Card = (props) => {
  const { level, color } = Priority(props.Priority);

  return (
    <div
      className="dashboard-card"
      onClick={props.clicked}
      style={{ color: color }}
    >
      <h2>Total: {level}</h2>
      <p>{props.count}</p>
    </div>
  );
};

export default Card;
