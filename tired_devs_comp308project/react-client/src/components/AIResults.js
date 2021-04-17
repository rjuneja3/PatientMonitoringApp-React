import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Card from "react-bootstrap/Card";

function Result(props) {
  const newData = props.location.state;

  return (
    <div className="container">
      <div className="outer-wrapper">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <div className="container" align="center">
              <h2>Stroke Prediction - AI</h2>
            </div>
            {(function () {
              if (newData.ResultofTest[0] * 100 > 50)
                return (
                  <div className="container" align="center">
                    <Jumbotron>
                      <h4>Risk: High chance of stroke</h4>
                      <p>Chances of a stroke: {newData.ResultofTest[0]}</p>
                    </Jumbotron>
                  </div>
                );
              else {
                return (
                  <div className="container" align="center">
                    <Jumbotron>
                      <h4>No Risk: You are healthy</h4>
                      <p>Chances of a stroke: {newData.ResultofTest[0]}</p>
                    </Jumbotron>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Result);
	