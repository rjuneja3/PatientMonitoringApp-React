import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import DailyTipForm from "./Forms/DailyTipForm";
import EmergencyAlertList from "./EmergencyAlertList";

function NurseHomePage(props) {
  console.log(props);
  const { userId, setUserId } = props;
  const { username, setUsername } = props;
  const { user, setUser } = props;
  const { role, setRole } = props;
  const { showAlert } = props;

  useEffect(() => {}, []);

  return (
    <div>
      <div className="shadow p-3 mt-2 bg-white rounded">
        <EmergencyAlertList showAlert={showAlert} />
      </div>
      <div className="shadow p-3 mt-5 mb-5 bg-white rounded">
        <DailyTipForm role={role} username={username} />
      </div>
    </div>
  );
}

export default NurseHomePage;
