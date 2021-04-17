import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";

function DailyReportForm(props) {
  // console.log("props" + props.history.location.state);
  // const role = props.history.location.state.role;
  // const username = props.history.location.state.username;
  const { role } = props;
  const { username } = props;
  const [dailyBodyTemprature, setDailyBodyTemprature] = useState("");
  const [dailyPulseRate, setDailyPulseRate] = useState("");
  const [dailySystolicBloodPressure, setDailySystolicBloodPressure] = useState(
    ""
  );

  const [
    dailyDiastolicBloodPressure,
    setDailyDiastolicBloodPressure,
  ] = useState("");
  const [dailyRespiratoryRate, setDailyRespiratoryRate] = useState("");

  const [errorMessage, setErrorMessage] = useState([]);
  const [ifError, setIfError] = useState(false);

  const apiUrl = "http://localhost:3000/api/dailyReports";

  const addDailyReport = (e) => {
    e.preventDefault();
    const data = {
      bodyTemprature: dailyBodyTemprature,
      pulseRate: dailyPulseRate,
      systolicBloodPressure: dailySystolicBloodPressure,
      diastolicBloodPressure: dailyDiastolicBloodPressure,
      respiratoryRate: dailyRespiratoryRate,
      patient: username,
    };
    console.log("data" + data);
    axios
      .post(apiUrl, data)
      .then((response) => {
        console.log("result" + response);
        if (response.data.message != "" || response.data.message != undefined) {
          errorMessage.push(response.data.message);
          setIfError(true);
        }
        props.history.push("/login");
      })
      .catch((error) => {
        errorMessage.push(error.message);
        setIfError(true);
        console.log("error" + error);
      });
  };

  return (
    // <div className="main-wrapper">

    // <div className="main-inner">

    <div>
      <Modal.Header >
        <div>
          <Modal.Title>
            <h1>Daily Report Form</h1>
          </Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div>
          {errorMessage.length !== 0 ? (
            <div>
              {errorMessage.map((item, index) => (
                <Alert className="text-center" variant="danger" key={index}>
                  {item}
                </Alert>
              ))}
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <Form onSubmit={addDailyReport}>
          <Form.Row>
            <Form.Group as={Col} md="12">
              <Form.Label>Body Temprature</Form.Label>
              <small>( in °F)</small>
              <Form.Control
                name="dailyBodyTemprature"
                id="dailyBodyTemprature"
                placeholder="Enter Temprature"
                type="number"
                step="0.1"
                min="90"
                max="110"
                title="Temprature should be in range of 90°F to 108°F"
                required
                onChange={(e) => setDailyBodyTemprature(e.target.value)}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} md="12">
              <Form.Label>Pulse Rate</Form.Label>
              <Form.Control
                name="dailyPulseRate"
                id="dailyPulseRate"
                placeholder="Enter Pulse Rate"
                type="number"
                min="0"
                max="500"
                step="1"
                required
                onChange={(e) => setDailyPulseRate(e.target.value)}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} md="6">
              <Form.Label>Systolic Blood Pressure</Form.Label>
              <Form.Control
                name="dailySystolicBloodPressure"
                id="dailySystolicBloodPressure"
                placeholder="Enter Systolic Blood Pressure"
                type="number"
                min="0"
                required
                onChange={(e) => setDailySystolicBloodPressure(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Diastolic Blood Pressure</Form.Label>
              <Form.Control
                name="dailyDiastolicBloodPressure"
                id="dailyDiastolicBloodPressure"
                placeholder="Enter Diastolic Blood Pressure"
                type="number"
                min="0"
                required
                onChange={(e) => setDailyDiastolicBloodPressure(e.target.value)}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} md="12">
              <Form.Label>Respiratory Rate</Form.Label>
              <Form.Control
                name="dailyRespiratoryRate"
                id="dailyRespiratoryRate"
                placeholder="Enter Respiratory Rate"
                type="number"
                min="0"
                required
                onChange={(e) => setDailyRespiratoryRate(e.target.value)}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Button className="btn btn-block" type="submit">
              Submit
            </Button>
          </Form.Row>
        </Form>
      </Modal.Body>
    </div>
    // </div>
  );
}

export default withRouter(DailyReportForm);
