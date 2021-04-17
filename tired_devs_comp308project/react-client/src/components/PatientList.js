import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { useHistory } from "react-router-dom";


import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function PatientList(props) {
  let history = useHistory();

  console.log(props);
  const [patientList, setPatientList] = useState([]);
  const [ifError, setIfError] = useState(false);
  const { patientId, setPatientId } = props;

  const getPatientList = () => {
    const apiUrl = "http://localhost:3000/patients";

    axios
      .get(apiUrl)
      .then((response) => {
        if (!response) {
          console.log("Couldnt get the response");
        } else {
          var list = response.data;
          setPatientList(list);
          setIfError(false);
        }
      })
      .catch((err) => console.log("Some error: " + err));
  };

  const showReport = (id) => {
    console.log(id);
    setPatientId(id);
    history.push({
      pathname: '/patientReportHistory',
      state: {
        patientId: id
      },
    })
  };

  useEffect(() => {
    getPatientList();
  }, []);

  return (
    <div className="container">
      <div className="outer-wrapper">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <div className="bg-white">
              <h2>Patient List</h2>
              <hr className="hr-primary" />
              {patientList.length !== 0 ? (
                <div>
                  <ListGroup className="scrollbar scrollbar-primary  mt-3 mx-auto">
                    {patientList.map((item, idx) => (
                      <ListGroup.Item
                        className="  mb-auto bg-white"
                        key={idx}
                        onClick={() => {
                          showReport(item._id);
                        }}
                      >
                        {item.fullName}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              ) : (
                <div>No emergency alerts</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientList;
