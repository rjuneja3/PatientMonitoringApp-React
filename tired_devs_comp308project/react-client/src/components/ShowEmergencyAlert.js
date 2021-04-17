import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router-dom";
import Card from "react-bootstrap/esm/Card";

function ShowEmergencyAlert(props) {
  console.log(props);
  const alertId = props.match.params.id;
  const apiUrl = "http://localhost:3000/api/emergencyAlerts/" + alertId;
  const [alert, setAlert] = useState({});
  const [showLoading, setShowLoading] = useState(true);

  const getAlert = () => {
    axios
      .get(apiUrl)
      .then((response) => {
        if (!response) {
          console.log("some error");
        } else {
          console.log(response.data);
          setAlert(response.data);
          setShowLoading(false);
        }
      })
      .catch((err) => {
        console.log("error: " + err);
      });
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
              <Card className="text-left m-4">
                <Card.Body>
                  <Card.Title className="m-3">
                    {alert.createdAt
                      .toString()
                      .replace("T", " ")
                      .replace("Z", "")}{" "}
                    Posted {alert.patient.fullName}
                  </Card.Title>
                  <hr
                    className="shadow"
                    style={{
                      backgroundColor: "rgba(66,133,244,.8)",
                      height: "1px",
                    }}
                  />
                  <Card.Text className="m-3 alert alert-danger">{alert.alertMessage}</Card.Text>
                  <Card.Text className="m-3 font-weight-bold">Please call the patient at: {alert.patient.phoneNumber}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button
                    className="btn-block"
                    type="button"
                    variant="danger"
                    onClick={() => {
                      deleteAlert(alert._id);
                    }}
                  >
                    Remove Alert
                  </Button>
                </Card.Footer>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(ShowEmergencyAlert);
