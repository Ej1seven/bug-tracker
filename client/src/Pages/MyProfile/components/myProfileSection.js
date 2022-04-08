import React, { useState, useEffect } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import "./myProfileSection.css";

const MyProfileSection = (props) => {
  return (
    <div>
      <h2>{props.title}</h2>
      {!props.edit ? <p>{props.info}</p> : <></>}
    </div>
  );
};

export default MyProfileSection;
