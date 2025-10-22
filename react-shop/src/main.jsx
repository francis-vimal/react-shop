import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.render(
  <React.StrictMode>  
    <GoogleOAuthProvider clientId="974779697335-7pr7cr842t7dge134ouu44308dkr362e.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>,
  </React.StrictMode>,
  document.getElementById("root")
);
