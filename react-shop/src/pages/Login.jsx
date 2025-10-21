import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import LoginForm from "../components/Login/LoginForm";
import RegisterForm from "../components/Login/RegisterForm";

function Login() {
  return (
    <div className="p-4 d-flex flex-column justify-content-center align-items-center">
      {/* Pills navs */}
      <Tabs
        defaultActiveKey="login"
        id="auth-tabs"
        className="mb-3 nav-justified"
      >
        <Tab eventKey="login" title="Login">
          <LoginForm />
        </Tab>
        <Tab eventKey="register" title="Register">
          <RegisterForm />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Login;
