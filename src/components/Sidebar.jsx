import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  Offcanvas,
  Accordion,
} from "react-bootstrap";
import logo_negativa from "../assets/images/logo_sacchelli_negativa.svg";

function Sidebar() {
  return (
    <aside className="h-100  bg-dark d-none d-md-block overflow-auto" style=    {{ width: "15%" }}>
      <Navbar className="d-flex justify-content-center mt-3" >
        <img src={logo_negativa} alt="LOGO SACCHELLI" className="img-fluid" />
      </Navbar>
    </aside>
  );
}

export default Sidebar;
