import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Main from "./Main";

function Login({ isAuthenticated, setIsAuthenticated, setAuthData }) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState({});
  const [errorMessage, setErrorMessage] = useState([]);
  const [ifError, setIfError] = useState(false);

  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

  const url = "http://localhost:3000/signin";

  const readCookie = () => {
    axios
      .get("http://localhost:3000/read_cookie")
      .then((response) => {
        console.log("in readCookie");
        console.log(response.data);
        if (response.data.loggedIn === true) {
          var responseRole = response.data.role;
          var responseUsername = response.data.username;
          var responseUserId = response.data.id;
          var responseUser = response.data.user;

          setUsername(responseUsername);
          setUser(responseUser);
          setUserId(responseUserId);
          setIfError(false);
          setAuthData(responseUser);
          setRole(responseRole);
          setIsAuthenticated(true);

          // setRole(responseRole);
        } else {
          console.log("in read cookie. user not found");
          setRole("");
          setIsAuthenticated(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setRole("");
        setIsAuthenticated(false);
      });
  };

  useEffect(() => {
    readCookie();
  }, []);

  function validation() {
    if (loginEmail == null || loginEmail == "") {
      var err = errorMessage;
      err.push("Please enter valid Email Address");
      setErrorMessage(err);
      setIfError(true);
    }

    if (loginPassword == null || loginPassword == "") {
      var err = errorMessage;
      err.push("Please enter valid Password");
      setErrorMessage(err);
      setIfError(true);
    } else if (!isEmail(loginEmail)) {
      console.log("ok : " + isEmail(loginEmail));
      var err = errorMessage;
      setIfError(true);
      err.push("Please enter valid format for Email Address");
      setErrorMessage(err);
    }
  }

  function isEmail(email) {
    return validEmailRegex.test(email);
  }

  const login = () => {
    console.log("List not cleared: " + errorMessage);
    errorMessage.forEach((element) => {
      errorMessage.pop(element);
    });
    console.log("List cleared: " + errorMessage);
    if (
      loginEmail == "" ||
      loginPassword == "" ||
      isEmail(loginEmail) == false
    ) {
      validation();
      setIfError(true);
      console.log("error list: " + errorMessage);
      return false;
    }
    var data = {
      auth: {
        username: loginEmail,
        password: loginPassword,
      },
    };

    axios
      .post(url, data)
      .then((response) => {
        console.log("response.data.message: " + response.data.status);
        if (response.data.status == 401) {
          //if user not found or password is invalid returns message from rest server
          var err = errorMessage;
          err.push(response.data.message);
          setErrorMessage(err);
          setIfError(true);
          console.log("In response error: " + errorMessage);
        } else {
          console.log("response.data.user._id: " + response.data.user._id);
          if (response.data.role !== undefined) {
            //if logged in successfully

            setUsername(response.data.username);
            setUser(response.data.user);
            setUserId(response.data.user._id);
            setAuthData(response.data.user);
            // setIsAuthenticated(true);
            setRole(response.data.role);
            setIsAuthenticated(true);
            setIfError(false);
          }
        }
      })
      .catch((e) => {
        var err = errorMessage;
        err.push(e.Error);
        console.log("error: " + e);
        setErrorMessage(err);
        setIfError(true);
      });
  };

  return (
    <div className="container">
      {isAuthenticated === false ? (
        <div className="outer-wrapper">
          <div className="auth-wrapper">
            <div className="auth-inner">
              <div className="login-wrapper">
                <h1>Login</h1>
                <div>
                  {errorMessage.length !== 0 ? (
                    <div>
                      <Alert className="text-center" variant="danger">
                        {errorMessage.map((item, index) => (
                          <pre key={index}>{item}</pre>
                        ))}
                      </Alert>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <Form.Row>
                  <Form.Group as={Col} md="12">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      name="username"
                      id="username"
                      placeholder="email"
                      type="email"
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} md="12">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name="password"
                      id="password"
                      placeholder="password"
                      type="password"
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Button
                    className="btn btn-block"
                    type="submit"
                    onClick={login}
                  >
                    Log in
                  </Button>
                </Form.Row>
                <div className="mt-3">
                  <p className="text-center">
                    Not have an account?{" "}
                    <a href="/patientRegistration">Sign Up as a Patient</a>
                  </p>
                  <p className="text-center">
                    Not a patient?{" "}
                    <a href="/nurseRegisteration">Sign Up as a Nurse</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" main-wrapper">
          <div className="main-inner">
            <Main
              username={username}
              setUsername={setUsername}
              user={user}
              setUser={setUser}
              userId={userId}
              setUserId={setUserId}
              role={role}
              setRole={setRole}
              setIsAuthenticated={setIsAuthenticated}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default withRouter(Login);
