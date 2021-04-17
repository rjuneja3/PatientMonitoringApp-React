import React, { useState } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";

function StrokeAI(props) {
  const [Status, setStatus] = useState("No");
  const [testData, settestData] = useState({
    weight: 0,
    age: 0,
    blood_fat: 0,
    body_fat: 0,
    storke: 1,
  });
  const [testResult, settestResult] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const apiUrl = "http://localhost:3000/api/training";

  const Training = async () => {
    setShowLoading(true);
    const data = {
      weight: parseFloat(testData.weight),
      age: parseFloat(testData.age),
      blood_fat: parseFloat(testData.blood_fat),
      body_fat: parseFloat(testData.body_fat),
    };
    try {
      if (
        data.weight === 0 ||
        data.age === 0 ||
        data.blood_fat === 0 ||
        data.body_fat === 0
      ) {
        window.alert("Please Check values");
      } else {
        const result = await axios.post(apiUrl, data);

        if (result.data.Status !== undefined) {
          setStatus(result.data.Status);
          settestResult(result.data.resultForTest1);
        }
      }
    } catch (e) {
      console.log(e);
    }
    setShowLoading(false);
  };

  const onChange = (e) => {
    e.persist();
    settestData({ ...testData, [e.target.name]: e.target.value });
  };

  if (Status === "No") {
    return (
      <div className="main-wrapper">
        <div className="main-inner">

              <div className="container" align="center">
                <h2>Stroke Prediction - AI</h2>
              </div>
              <div className="shadow p-3 mt-2 bg-white rounded">
                <div className="col-md-12" style={{ textAlign: "center" }}>
                  {showLoading && (
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  )}
                </div>
                <Form>
                  <Form.Group>
                    <Form.Label> weight</Form.Label>
                    <Form.Control
                      type="number"
                      name="weight"
                      id="weight"
                      min="0"
                      step="0.01"
                      placeholder="weight sepal_length"
                      value={testData.weight}
                      onChange={onChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>age</Form.Label>
                    <Form.Control
                      type="number"
                      name="age"
                      id="age"
                      min="0"
                      step="1"
                      placeholder="Enter age"
                      value={testData.age}
                      onChange={onChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>blood_fat</Form.Label>
                    <Form.Control
                      type="number"
                      name="blood_fat"
                      id="blood_fat"
                      min="0"
                      step="0.01"
                      placeholder="Enter blood_fat"
                      value={testData.blood_fat}
                      onChange={onChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>body_fat</Form.Label>
                    <Form.Control
                      type="number"
                      name="body_fat"
                      id="body_fat"
                      min="0"
                      step="0.01"
                      placeholder="Enter body_fat"
                      value={testData.body_fat}
                      onChange={onChange}
                    />
                  </Form.Group>
                </Form>
                <Button className="btn btn-primary btn-block" onClick={Training}>
                  Test
                </Button>
              </div>
            </div>
          </div>
    );
  } else {
    return (
      <div className="container">
        <div className="outer-wrapper">
          <div className="auth-wrapper">
            <div className="auth-inner">
              <div className="container" align="center">
                <h1>Test is Done</h1>
                <p className="lead">Click the button to see the result</p>
                <Link className="btn-block"
                  to={{
                    pathname: "/AIResult",
                    state: {
                      ResultofTest: testResult,
                    },
                  }}
                >
                  Show Result
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(StrokeAI);