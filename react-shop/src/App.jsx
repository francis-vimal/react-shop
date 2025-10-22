import React from "react";
import { BrowserRouter as Router, Switch, Route, useLocation } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import "./App.css";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === "/login" || location.pathname === "/";

  return (
    <>
    { !hideNav && <AppNavbar /> }
    <Switch>        
      <Route path="/login" component={Login} />
      {/* Protected Pages */}
      <PrivateRoute path="/home" component={Home} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <PrivateRoute path="/cart" component={Cart} />
      <PrivateRoute path="/product/:id" component={ProductDetails} />
      {/* Default Page */}
      <Route path="/" component={Login} />
    </Switch>
    </>
  );
}

export default App;
