import React from "react";
import ReactDOM from "react-dom/client";
import MyApp from "./MyApp";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MyApp />
  </React.StrictMode>,
);
