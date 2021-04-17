import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

function PatientReportHistory(props) {
  console.log(props);
  const { patientId } = props;
  const [reports, setReports] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const apiUrl = "http://localhost:5000/api/dailyReports/users/" + patientId;

  const getReports = () => {
    console.log("in getReports");
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        setReports(response.data);
        setShowLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getReports();
  }, []);

  return (
    <div className="container">
        <div className="main-wrapper">
          <div className="main-inner">
            <div className="">
              <h1>Daily Reports</h1>
            </div>
            <hr
              className="shadow"
              style={{
                backgroundColor: "rgba(66,133,244,.8)",
                height: "1px",
              }}
            />
            {showLoading ? (
              <div className="text-center">
                <Spinner className="mt-5" animation="border" role="status">
                  <span className="sr-only">Waiting for results...</span>
                </Spinner>
              </div>
            ) : (
              <div>
                {reports.length < 1 ? (
                  <div>
                    <div className="alert alert-danger">No Reports</div>
                  </div>
                ) : (
                  <div>
                    <Table striped bordered>
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Body Temprature</th>
                          <th>Pulse Rate</th>
                          <th>Systolic Blood Pressure</th>
                          <th>Diastolic Blood Pressure</th>
                          <th>Respiratory Rate</th>
                        </tr>
                      </thead>
                      {reports.map((item, index) => {
                        return (
                          <tr>
                            <td>
                              {item.createdAt
                                .toString()
                                .substring(0, 19)
                                .replace("T", " ")
                                .replace("Z", "")}
                            </td>
                            <td>{item.bodyTemprature}</td>
                            <td>{item.pulseRate}</td>
                            <td>{item.systolicBloodPressure}</td>
                            <td>{item.diastolicBloodPressure}</td>
                            <td>{item.respiratoryRate}</td>
                          </tr>
                        );
                      })}
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default PatientReportHistory;
