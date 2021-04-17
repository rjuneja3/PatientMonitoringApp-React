import React, { useState, useEffect, useRef } from "react";

import axios from "axios";

import { withRouter } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import Jumbotron from "react-bootstrap/Jumbotron";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import Select from "react-select";

function PatientRegistration(props) {
  const url = "http://localhost:3000/";

  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerAddress, setRegisterAddress] = useState("");
  const [registerPhoneNumber, setRegisterPhoneNumber] = useState("");
  const [registerRole, setRegisterRole] = useState("");
  const [regiserPassword, setRegisterPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState([]);
  const [ifError, setIfError] = useState(false);

  const register = (e) => {
    e.preventDefault();
    const data = {
      firstName: registerFirstName,
      lastName: registerLastName,
      username: registerUsername,
      password: regiserPassword,
      address: registerAddress,
      phoneNumber: registerPhoneNumber,
      role: "patient",
    };
    console.log("Data" + data.address);

    axios
      .post(url, data)
      .then((res) => {

        errorMessage.forEach((element) => {
          errorMessage.pop(element);
        });

        console.log(res.data);

        if(res.data.username ==data.username){
          console.log(res);
        props.history.push("/login");
        }else{
          console.log(res);
          var err = errorMessage;
          err.push(res.data);
          setErrorMessage(err);
          setIfError(true);
          console.log(errorMessage);
          return false;
        }
      })
      .catch((err) => console.log("Error: " + err));
  };

  const handleChange = (address) => {
    setRegisterAddress(address);
  };

  const handleSelect = (address) => {
    setRegisterAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log("Success", latLng))
      .catch((error) => console.error("Error", error));
  };

  return (
    <div className="outer-wrapper">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div>
            <h1>Patient Registration</h1>
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
            <Form onSubmit={register}>
              <Form.Row>
                <Form.Group as={Col} md="6">
                  <Form.Label>Firstname</Form.Label>
                  <Form.Control
                    name="firstName"
                    id="firstName"
                    placeholder="firstName"
                    type="text"
                    onChange={(e) => setRegisterFirstName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Lastname</Form.Label>
                  <Form.Control
                    name="lastName"
                    id="lastName"
                    placeholder="lastName"
                    type="text"
                    onChange={(e) => setRegisterLastName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="12">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="username"
                    id="username"
                    placeholder="email"
                    type="email"
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    required
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md="6">
                  <Form.Label>Address</Form.Label>
                  {/* <Form.Control id="autocomplete"
                name="address"
                id="address"
                placeholder="address"
                type="text"
                onChange={(e) => setRegisterAddress(e.target.value)}
                required
              /> */}
                  <PlacesAutocomplete
                    value={registerAddress}
                    onChange={handleChange}
                    onSelect={handleSelect}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div>
                        <Form.Control
                          required
                          {...getInputProps({
                            placeholder: "Search Places ...",
                            className: "location-search-input",
                          })}
                        />
                        <ListGroup
                          variant="flush"
                          as="ul"
                          className="autocomplete-dropdown-container overflow-auto"
                        >
                          {loading && <div>Loading...</div>}
                          {suggestions.map((suggestion, index) => {
                            const className = suggestion.active
                              ? "suggestion-item--active active"
                              : "suggestion-item";
                            return (
                              <ListGroup.Item
                                key={index}
                                as="li"
                                className="overflow-auto autocomplete-suggestions"
                                {...getSuggestionItemProps(suggestion, {
                                  className,
                                })}
                              >
                                <span>{suggestion.description}</span>
                              </ListGroup.Item>
                            );
                          })}
                        </ListGroup>
                      </div>
                    )}
                  </PlacesAutocomplete>
                  <div></div>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Phone Number </Form.Label>
                  <Form.Control
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="4356758767"
                    pattern="[2-9]{1}[0-9]{9}"
                    title="Phone number should contain 10 digits without any special characters. Phone number should start with 2-9"
                    type="text"
                    onChange={(e) => setRegisterPhoneNumber(e.target.value)}
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
                    type="password"
                    placeholder="password"
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Button className="btn btn-block" type="submit">
                  Register
                </Button>
              </Form.Row>
            </Form>
            <div className="mt-3">
              <p className="text-center">
                Already have an account? <a href="/login">Log In</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(PatientRegistration);
