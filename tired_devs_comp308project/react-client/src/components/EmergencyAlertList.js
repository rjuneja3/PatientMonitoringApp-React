import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
// import { MDBContainer } from "mdbreact";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";

function EmergencyAlertList(props) {
  console.log(props);
  const { showAlert } = props;
  const [alertList, setAlertList] = useState([]);
  const [ifError, setIfError] = useState(false);

  const getEmergencyAlerts = () => {
    const apiUrl = "http://localhost:3000/api/emergencyAlerts";

    axios
      .get(apiUrl)
      .then((response) => {
        if (!response) {
          console.log("Couldnt get the response");
        } else {
          var list = response.data;
          setAlertList(list);
          setIfError(false);
        }
      })
      .catch((err) => console.log("Some error: " + err));
  };

  useEffect(() => {
    getEmergencyAlerts();
  }, []);

  return (
    <div>
      <h4>Emergency Alerts List</h4>
      <hr
        className="shadow"
        style={{
          backgroundColor: "rgba(66,133,244,.8)",
          height: "1px",
        }}
      />
      <div className="m-3">
        {alertList.length !== 0 || alertList !== [] ? (
          <div>
            <div
              className="scrollbar scrollbar-primary  mt-3 mx-auto"
              style={{ maxHeight: "300px" }}
            >
              <Table hover responsive>
                <thead>
                  <tr className="text-left">
                    <th>Date-Time</th>
                    <th>Patient Name</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {alertList.map((item, idx) => (
                    <tr
                      className="text-md-left"
                      key={idx}
                      onClick={() => {
                        showAlert(item._id);
                      }}
                    >
                      <td>
                        {item.createdAt
                          .toString()
                          .replace("T", " ")
                          .replace("Z", "")}
                        {"  "}
                      </td>
                      <td>{item.patient.fullName}</td>
                      <td>{item.alertMessage}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        ) : (
          <div>No emergency alerts</div>
        )}
      </div>
    </div>
  );
}

export default EmergencyAlertList;
