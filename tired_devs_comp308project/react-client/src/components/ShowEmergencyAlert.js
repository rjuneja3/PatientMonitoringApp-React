import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router-dom";

function ShowEmergencyAlert(props) {
  console.log(props);
  const alertId = props.match.params.id;
  const apiUrl = "http://localhost:3000/api/emergencyAlerts/" + alertId;
  const [alert, setAlert] = useState({});
  const [showLoading, setShowLoading] = useState(true);

  const getAlert = async () => {
    try {
      const response = await axios.get(apiUrl);
      if (!response) {
        console.log("some error");
      } else {
        console.log(response.data);
        setAlert(response.data);
        setShowLoading(false);
      }
    } catch (err) {
      console.log("error: " + err);
    }
  };

  const deleteAlert = async () => {
    try {
      const response = await axios.delete(apiUrl);
      if (!response) {
        console.log("some error");
      } else {
        console.log(response.data);
        setShowLoading(false);
        props.history.push("/login");
      }
    } catch (err) {}
  };

  useEffect(() => {
    getAlert();
  }, []);

  return (
    <div className="container">
      <div className="flex-container">
        <div className="flex-box">
          {showLoading ? (
            <Spinner animation="border" role="statue">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <div>
              <Jumbotron>
                <h1>{alert.alertMessage}</h1>
                <p>{alert.patient.username}</p>
                <p>Please call the patient at: {alert.patient.phoneNumber}</p>
              </Jumbotron>
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  deleteAlert(alert._id);
                }}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(ShowEmergencyAlert);
