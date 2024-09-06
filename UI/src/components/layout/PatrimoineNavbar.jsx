
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavbarComponent = () => (
  <Navbar bg="dark" variant="dark" expand="lg" className="p-3 position-fixed w-100 z-1" style={{ backgroundColor: "#2c3e50", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
    <Navbar.Brand as={Link} to="/" style={{ color: "#ecf0f1", fontSize: "1.5rem", fontWeight: "bold" }}>
      Patrimoines
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: "#34495e" }} />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        <Nav.Link as={Link} to="/possessions" style={{ color: "#ecf0f1", fontSize: "1.1rem", marginLeft: "1rem" }}>
          Possessions
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default NavbarComponent;
