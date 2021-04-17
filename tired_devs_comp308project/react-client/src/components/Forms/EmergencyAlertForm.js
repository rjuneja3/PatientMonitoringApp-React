import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import { Model } from "mongoose";

function EmergencyAlertForm(props) {
  //   console.log("props" + props.history.location.state);
  const { role } = props;
  const { username } = props;
  const {handleClose} = props;
  const {handleShow} = props;
  const [alertMessage, setAlertMessage] = useState("");
  const [message, setMessage] = useState("");
  const [ifError, setIfError] = useState(false);

  const apiUrl = "http://localhost:3000/api/emergencyAlerts";

  const sendEmergencyAlert = (e) => {
    e.preventDefault();
    const data = {
      alertMessage: alertMessage,
      patient: username,
    };
    console.log("data" + data.patient);
    axios
      .post(apiUrl, data)
      .then((response) => {
        console.log(response.data);

        if (response.data.message != "" || response.data.message != undefined) {
          console.log("response.data.message" + response.data.message);
          setIfError(true);
        }
        setAlertMessage("");
        setMessage("Sent");
        setTimeout(function() {
          setMessage("");
          handleClose();
      }, 2000);
        props.history.push("/login");
      })
      .catch((error) => {
        console.log("error in sending emergency alert: " + error.message);
        setIfError(true);
        console.log("error" + error);
      });
  };

  return (
    <div>
      <div>
        <Modal.Header closeButton>
          <Modal.Title>Send Emergency Alert</Modal.Title>
        </Modal.Header>
        
        <div>
          {message.length !== 0 ? (
            <div className="">
              <Alert className="text-center" variant="success">
                  Sent
              </Alert>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <Form onSubmit={sendEmergencyAlert}>
        <Modal.Body>
          <Form.Row>
            <Form.Group as={Col} md="12">
              <Form.Control
                as="textarea"
                rows="3"
                name="alertMessage"
                id="alertMessage"
                value={alertMessage}
                placeholder="Enter the emergency details for the doctor..."
                type="text"
                title="Temprature should be in range of 90°F to 108°F"
                required
                onChange={(e) => setAlertMessage(e.target.value)}
              />
            </Form.Group>
          </Form.Row>
          </Modal.Body>

          <Modal.Footer>
          <Form.Row>
            <Button className="btn btn-block" type="submit">
              Submit
            </Button>
          </Form.Row>
          </Modal.Footer>
        </Form>
      </div>
    </div>
  );
}

export default withRouter(EmergencyAlertForm);
