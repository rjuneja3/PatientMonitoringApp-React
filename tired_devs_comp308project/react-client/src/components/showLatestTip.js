import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Jumbotron from "react-bootstrap/Jumbotron";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router-dom";

function ShowLatestTip(props) {
  const [showLoading, setShowLoading] = useState(true);
  const [tip, setTip] = useState({});
  const [error, setError] = useState("");

  const apiUrl = "http://localhost:3000/api/dailyTips/latest";
  const getLatestTip = () => {
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data);
        if (response.data.message === "No records found") {
          console.log("No response data");
          setError("No tips added!");
          setShowLoading(false);
        }
        setTip(response.data);
        setShowLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getLatestTip();
  }, []);

  return (
    <div>
      {showLoading === true ? (
        <div className="text-center">
          <Spinner className="mt-5" animation="border" role="status">
            <span className="sr-only">Waiting for results...</span>
          </Spinner>
        </div>
      ) : (
        <div>
          {error.length !== 0 ? (
            <div>
              <div className="alert-danger">
                <h1 className=""alert>No Tips</h1>
              </div>
            </div>
          ) : (
            <div>
              <div>
                <h1>Today's Tip</h1>
              </div>
              <div>
                <Card>
                  <Card.Header as="h3">{tip.subject}</Card.Header>
                  <Card.Body>
                    <Card.Title>
                      By: {tip.author.firstName} {tip.author.lastName}
                    </Card.Title>
                    <Card.Text>{tip.tipMessage}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ShowLatestTip;
