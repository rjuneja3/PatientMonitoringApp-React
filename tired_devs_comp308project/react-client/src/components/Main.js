import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";


import NurseHomePage from "./NurseHomePage";
import PatientHomePage from "./PatientHomePage";


function Main(props) {
  console.log(props);
  const { userId, setUserId } = props;
  const { username, setUsername } = props;
  const { user, setUser } = props;
  const { setIsAuthenticated } = props;
  const { role, setRole } = props;

  console.log("user._id: " + userId);

  const addDailyReport = () => {
    props.history.push({
      pathname: "/dailyReportForm",
      state: {
        role: role,
        username: username,
      },
    });
  };

  const showAlert = (alertId) => {
    console.log(props);
    props.history.push({
      pathname: '/showEmergencyAlert/'+alertId,
      state: {
        alertId: alertId
      }
    });
  };

  return (
    <div className="">
      <h2 className="text-left m-3">
        Hi, <a className="text-capitalize">{role} {user.fullName}</a>
      </h2>
      <hr className="hr-primary" />
      {role == "patient" ? (
        //
        <div className="">
          <PatientHomePage
            user={user}
            username={username}
            userId={userId}
            addDailyReport={addDailyReport}
            role={role}
          />
        </div>
      ) : (
        <div>
          <NurseHomePage
            user={user}
            username={username}
            userId={userId}
            showAlert ={showAlert}
            role={role}
          />
        </div>
      )}
    </div>
  );
}

export default withRouter(Main);
