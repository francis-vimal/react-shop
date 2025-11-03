import React from "react";
import { Dropdown } from "react-bootstrap";
import { useHistory, NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

function AppNavbar() {
  const history = useHistory();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("googleUser");
    localStorage.removeItem("userId");
    history.push("/login");
  }

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        {/* <Navbar.Brand href="#home">Navbar</Navbar.Brand> */}
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/home" activeClassName="active">
            Home
          </Nav.Link>
          <Nav.Link as={NavLink} to="/login" activeClassName="active">
            Login
          </Nav.Link>
        </Nav>
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link className="d-flex align-items-center me-2" as={NavLink} to="/cart" activeClassName="active">
            <span className="material-symbols-outlined cartIcon">shopping_cart</span>
          </Nav.Link>
          <Navbar.Text>
            <Dropdown>
              <Dropdown.Toggle
                variant="dark"
                id="dropdown-basic"
                className="sort no-arrow"
              >
                <div className="account-arrow d-block link-body-emphasis text-decoration-none dropdown-toggle">
                  <img
                    src={
                      localStorage.getItem("googleUser")
                        ? JSON.parse(localStorage.getItem("googleUser")).picture
                        : "images/default_profile.jpg"
                    }
                    width="32"
                    height="32"
                    className="rounded-circle"
                    alt="profile image"
                  />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
                <Dropdown.Item className="text-danger" onClick={handleLogout}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
