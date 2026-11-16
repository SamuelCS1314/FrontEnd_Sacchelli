import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  Offcanvas,
} from "react-bootstrap";
import "./App.css";
import logo_sacchelli_negativa from "./assets/logo_sacchelli_negativa.svg";

function App() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  return (
    <>
      <Container fluid className="vh-100 d-flex flex-column p-0">
        <Navbar bg="dark" variant="dark" className="px-3 flex-shrink-0">
          <Button
            variant="outline-light"
            size="sm"
            className="d-md-none me-2"
            onClick={() => setShowMobileMenu(true)}
          >
            Menu
          </Button>
          <Navbar.Brand href="#home">
            <img src={logo_sacchelli_negativa} alt="LOGO SACCHELLI" />
          </Navbar.Brand>
        </Navbar>

        <Row className="g-0 flex-grow-1 overflow-hidden">
          <Col
            md={3}
            lg={1}
            className="d-none d-md-block bg-light border-end h-100 overflow-auto p-3"
          >
            <h6 className="text-uppercase text-muted small fw-bold">
              {" "}
              Navigation{" "}
            </h6>
            <Nav className="flex-column">
              <Nav.Link href="#chat-1" active>
                Currente Session
              </Nav.Link>
              <Nav.Link href="#chat-2">Previous Notes</Nav.Link>
              <Nav.Link href="#settings">Settings</Nav.Link>
            </Nav>
          </Col>

          <Col xs={12} md={9} lg={10} className="h-100 overflow-auto p-4">
            <div className="mx-auto" style={{ maxWidth: "800px" }}>
              <h2>Main Content Area</h2>
              <p>
                This Painel scrolls independently while the Header and SideBar
                stay locked in place.
              </p>
            </div>
          </Col>
        </Row>

        <Offcanvas
          show={showMobileMenu}
          onHide={() => setShowMobileMenu(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Navigation</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link href="#chat-1">Currente Session</Nav.Link>
              <Nav.Link href="#chat-2">Previous Note</Nav.Link>
              <Nav.Link href="#settings">Settings</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </>
  );
}

export default App;
