exports.train = function (req, res) {
    const tf = require("@tensorflow/tfjs");
    require("@tensorflow/tfjs-node");
    //load data training and testing data
    const data = require("../../patients.json");
    const dataTesting = [
      {
        weight: req.body.weight,
        age: req.body.age,
        blood_fat: req.body.blood_fat,
        body_fat: req.body.body_fat,
        storke: req.body.storke,
      },
    ];
  
    //
    // convert/setup our data for tensorflow.js
    //
    //tensor of features for training data
    const trainingData = tf.tensor2d(
      data.map((item) => [item.weight, item.age, item.blood_fat, item.body_fat])
    );
    //tensor of output for training data
  
    const outputData = tf.tensor2d(
      data.map((item) => [item.storke === 1 ? 1 : 0, item.storke === 2 ? 1 : 0])
    );
    //
    //tensor of features for testing data
    const testingData = tf.tensor2d(
      dataTesting.map((item) => [
        item.weight,
        item.age,
        item.blood_fat,
        item.body_fat,
      ])
    );
  
    // build neural network using a sequential model
    const model = tf.sequential();
    //add the first layer
    model.add(
      tf.layers.dense({
        inputShape: [4], // 19 input neurons (features)
        activation: "sigmoid",
        units: 20, //dimension of output space (first hidden layer)
      })
    );
    //add the first hidden layer
    model.add(
      tf.layers.dense({
        inputShape: [20], //dimension of hidden layer (2/3 rule)
        activation: "sigmoid",
        units: 10, //dimension of final output (die or live)
      })
    );
    //add the first hidden layer
    model.add(
      tf.layers.dense({
        inputShape: [10], //dimension of hidden layer (2/3 rule)
        activation: "sigmoid",
        units: 2, //dimension of final output (die or live)
      })
    );
    //add output layer
    model.add(
      tf.layers.dense({
        activation: "sigmoid",
        units: 2, //dimension of final output
      })
    );
    //compile the model with an MSE loss function and Adam algorithm
    model.compile({
      //categoricalCrossentropy
      loss: "meanSquaredError",
      optimizer: tf.train.adam(0.003),
      metrics: ["accuracy"],
    });
    // train/fit the model for the fixed number of epochs
    const startTime = Date.now();
    model.fit(trainingData, outputData, { epochs: 100 }).then((history) => {
      //console.log(history);
      //display prediction results for the inpud samples
      const results = model.predict(testingData);
      //model.predict(testingData).print();
      elapsedTime = Date.now() - startTime;
      results.array().then((array) => {
        const resultForTest1 = array[0];
        console.log(resultForTest1);
        res
          .status(200)
          .send({
            Status: "traind",
            resultForTest1: resultForTest1,
          })
          .end();
      });
    });
  };
  