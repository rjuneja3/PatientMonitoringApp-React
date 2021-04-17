import React, { useState, useEffect } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import { Model } from "mongoose";

function DailyTipForm(props) {
  //   console.log("props" + props.history.location.state);
  const { role } = props;
  const { username } = props;
  const [subject, setSubject] = useState("");
  const [tipMessage,setTipMessage] = useState("");
  const [message, setMessage] = useState("");
  const [ifError, setIfError] = useState(false);

  const apiUrl = "http://localhost:3000/api/dailyTips";

  const addDailyTip = (e) => {
    e.preventDefault();
    const data = {
      subject: subject,
      tipMessage:tipMessage,
      author: username,
    };
    axios
      .post(apiUrl, data)
      .then((response) => {
        console.log(response.data);

        if (response.data.message != "" || response.data.message != undefined) {
          console.log("response.data.message" + response.data.message);
          setIfError(true);
        }
        setMessage("Sent");
        setSubject("");
        setTipMessage("");
        setTimeout(function() {
          setMessage("");
      }, 2000);
      
        props.history.push("/login");
      })
      .catch((error) => {
        console.log("error in sending emergency alert: " + error.message);
        setIfError(true);
        console.log("error" + error);
      });
  };

  return (
    <div>
      <div>
        <h4>Send Motivational Tips</h4>
        <hr className="shadow"
          style={{
            backgroundColor: "rgba(66,133,244,.8)",
            height: "1px",
          }}
        />
        <div className="m-3 ">
          <div>
            {message.length !== 0 ? (
              <div className="">
                <Alert className="text-center" variant="success">
                  {message}
                </Alert>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <Form onSubmit={addDailyTip}>
            <Form.Row>
              <Form.Group as={Col} md="12">
                <Form.Control
                  name="subject"
                  id="subject"
                  value={subject}
                  placeholder="Enter the Subject"
                  type="text"
                  title="Please Enter the Subject "
                  required
                  onChange={(e) => setSubject(e.target.value)}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="12">
                <Form.Control
                  as="textarea"
                  rows="3"
                  name="tipMessage"
                  id="tipMessage"
                  value={tipMessage}
                  placeholder="Enter the Tips for patients...."
                  type="text"
                  title="Please enter the tip message"
                  required
                  onChange={(e) => setTipMessage(e.target.value)}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Button className="btn btn-block" type="submit">
                Submit
              </Button>
            </Form.Row>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default withRouter(DailyTipForm);
