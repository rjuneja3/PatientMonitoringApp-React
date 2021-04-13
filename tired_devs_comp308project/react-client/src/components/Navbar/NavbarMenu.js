import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

function NavBarMenu(props) {
  console.log(props);
  const { user, setUser } = props;
  const { isAuthenticated, setIsAuthenticated } = props;
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [role, setRole] = useState("");

  const readCookie = async () => {
    try {
      const response = await axios.get("http://localhost:3000/read_cookie");
      console.log("in readCookie");
      console.log(response.data);
      if (response.data.loggedIn === true) {
        var responseUser = response.data.user;
        setUser(responseUser);
        setIsAuthenticated(true);
      } else {
        console.log("in read cookie. user not found");
        setRole("");
        // setIsAuthenticated(false);
      }
    } catch (err) {
      console.log(err);
      setRole("");
      // setIsAuthenticated(false);
    }
  };

  const deleteCookie = async () => {
    try {
      await axios.get("/signout");
      setEmail("");
      setIsAuthenticated(false);

      setId("");
      props.history.push("/login");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    readCookie();
  }, []);

  return (
    <Navbar collapseOnSelect bg="light" expand="lg" className="fixed-top">
      <div className="container">
        <Nav.Link className="navbar-brand d-inline-block" href="/login">
          Final Project
        </Nav.Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {isAuthenticated == false ? (
              <div>
                <Nav.Link className="nav-link" href="/patientRegistration">
                  Patient Sign up
                </Nav.Link>
                <Nav.Link className="nav-link" href="/nurseRegisteration">
                  Nurse Sign up
                </Nav.Link>
              </div>
            ) : (
              <div>
                {user.role==="patient"?(
                  <div>
                    <Nav.Link>Patient</Nav.Link>
                  </div>
                ):(
                  <div>
                    <Nav.Link href="patientList">Patient List</Nav.Link>
                  </div>
                )}
              </div>
            )}
          </Nav>

          {isAuthenticated == true ? (
            <div>
              <Nav>
                <Nav.Link>{user.username}</Nav.Link>
                <Button variant="outline-primary" onClick={deleteCookie}>
                  Log Out
                </Button>
              </Nav>
            </div>
          ) : (
            <div></div>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default withRouter(NavBarMenu);
