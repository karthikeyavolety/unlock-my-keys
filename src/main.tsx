import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";   // or "./App.tsx" based on your file
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);