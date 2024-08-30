// frontend/src/components/Header.jsx
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">Patrimoine</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/possession">Possession</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default Header;
