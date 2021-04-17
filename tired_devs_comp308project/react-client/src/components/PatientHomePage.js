import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import EmergencyAlertForm from "./Forms/EmergencyAlertForm";
import DailyReportForm from "./Forms/DailyReportForm";
import ShowLatestTip from "./showLatestTip";

function PatientHomePage(props) {
  const { userId, setUserId } = props;
  const { username, setUsername } = props;
  const { user, setUser } = props;
  const { addDailyReport } = props;

  const [report, setReport] = useState({});
  const [dailyReportRequired, setDailyReportRequired] = useState(false);
  const { role, setRole } = props;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  console.log("user._id: " + userId);

  const getLatestReport = () => {
    console.log("in getLatestReport. userId: " + userId);
    const url = "http://localhost:3000/api/dailyReports/latest/users/" + userId;

    axios
      .get(url)
      .then((response) => {
        console.log("response:" + response);

        if (!response.data.message == "No records found") {
          console.log("No old records for user: " + username);
          setDailyReportRequired(true);
          return false;
        } else {
          //if no timestamps in the response display add report button
          if (!response.data.createdAt || response.data.createdAt == null) {
            setDailyReportRequired(true);
          } else {
            //display the add report button only if the user have not added daily report for 24 hours
            console.log("response.data: " + response.data);
            console.log("Response.data.createdAt" + response.data.createdAt);
            setReport(response.data);
            setDailyReportRequired(false);
            var createdAt = new Date(response.data.createdAt);
            var dateNow = new Date();
            var timeDifference = Math.abs(dateNow - createdAt);
            console.log("dateDifference: " + timeDifference);
            var dayDifference = Math.ceil(
              timeDifference / (1000 * 60 * 60 * 24)
            );
            console.log("dayDifference: " + dayDifference);
            if (dayDifference > 1) {
              //changed 1 to 0 for testing
              setDailyReportRequired(true);
            } else {
              setDailyReportRequired(false);
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (user.role == "patient") {
      getLatestReport();
    }
  }, []);

  return (
    <div>
      <div>
        {dailyReportRequired == true ? (
          <div className="shadow p-3 mt-2 bg-white rounded">
            {/* <Button className="btn btn-primary" onClick={addDailyReport}>
              Add Report
            </Button> */}
            <Modal.Dialog>
              <DailyReportForm username={username} role={role} user={user} />
            </Modal.Dialog>
          </div>
        ) : (
          <div></div>
        )}
        <hr className="hr-primary" />
        <div>
          
        </div>
        <hr className="hr-primary" />
        <div className="shadow p-3 mt-2 bg-white rounded">
          <ShowLatestTip/>
        </div>
        <div className="shadow p-3 mt-2 bg-white rounded">
          <div className="row">
            <div className="col-md-12 ">
              <Form.Control
                placeholder="Send an Emergency Alert to the Doctor...."
                onClick={handleShow}
                readOnly
              />

              <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}
              >
                <EmergencyAlertForm
                  handleClose={handleClose}
                  handleShow={handleShow}
                  role={role}
                  username={username}
                />
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientHomePage;
