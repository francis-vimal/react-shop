import './custom.scss';
import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from "./context/Appcontext.jsx";

ReactDOM.render(
  <AppProvider>
    <GoogleOAuthProvider clientId="974779697335-7pr7cr842t7dge134ouu44308dkr362e.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>,
  </AppProvider>,
  document.getElementById("root")
);
