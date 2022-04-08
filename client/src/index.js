import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// Imported Google Font Roboto to top level of application
import "@fontsource/roboto";
//Imported React Bootstrap Table - A configurable, functional table component which allows you  to build a Bootstrap Table more efficiency and easy in the React application
//Imported React Bootstrap Pagination -Allow developer to customize the Bootstrap Table with text, styling etc
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
