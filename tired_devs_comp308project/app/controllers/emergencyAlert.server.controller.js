const mongoose = require("mongoose");
const EmergencyAlert = mongoose.model("EmergencyAlert");
const User = mongoose.model("User");

const getErrorMessage = function (err) {
  var message = "";
  if (err.code) {
    switch (err.code) {
      default:
        message = "something went wrong";
    }
  } else {
    for (const errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }
  return message;
};

exports.create = function (req, res) {
  console.log("In Create");
  const emergencyAlert = new EmergencyAlert();
  emergencyAlert.alertMessage = req.body.alertMessage;
  var usr = new User();
  console.log("req.body: " + req.body.patient);

  User.findOne({ username: req.body.patient }, (err, user) => {
    if (err) {
      return getErrorMessage(err);
    }
    if (!user || user == null || user == undefined) {
      res.json({ message: "User not found" });
      return next(err);
    }
    console.log("user found: " + user);
    usr._id = user._id;
    //req._id = user._id;
  }).then(function () {
    emergencyAlert.patient = usr._id;

    console.log("emergencyAlert.patient: " + emergencyAlert.patient);

    emergencyAlert.save((err) => {
      if (err) {
        return res.status(400).send({ message: getErrorMessage(err) });
      } else {
        res.status(200).json(emergencyAlert);
      }
    });
  });
};

exports.list = function (req, res) {
  EmergencyAlert.find()
    .sort("-createdAt")
    .sort("-patient")
    .populate('patient')
    .exec((err, alerts) => {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err),
        });
      } else {
        return res.status(200).json(alerts);
      }
    });
};

exports.infoByID = function (req, res, next, id) {
  console.log("in infoById: "+ id);
  EmergencyAlert.findOne({_id: id}).populate('patient').exec((err, emergencyAlert) => {
    if (err) return next(err);
    if (!emergencyAlert)
      return next(new Error("Failed to load emergencyAlert " + id));
    req.emergencyAlert = emergencyAlert;
    req.alertId = emergencyAlert._id;
    next();
  });
};

exports.hasAuthorization = function (req, res, next) {
  if (!req.emergencyAlert.patient === req.user._id) {
    return res.status(403).send({
      message: "User is not authorized",
    });
  }
  next();
};

exports.read = function (req, res) {
  // update read item
  EmergencyAlert.findOneAndUpdate(
    { _id: req.alertId },
    { unread: false },
    function (err, emergencyAlert) {
      if (err) {
        return next(err);
      }
      res.status(200).json(emergencyAlert);
    }
  ).populate('patient');
};

exports.update = function (req, res) {
  EmergencyAlert.findOneAndUpdate(
    {_id:req.alertId},
    req.body,
    function (err, emergencyAlert) {
      if (err) {
        return next(err);
      }
      console.log("updated successfully: "+ emergencyAlert);

      res.json(emergencyAlert);
    }
  );
};

exports.delete = function (req, res) {
  
  console.log("req.alertId: " +req.alertId)
  EmergencyAlert.findOneAndRemove(
    { _id: req.alertId },
    req.body,
    function (err, emergencyAlert) {
      if (err) return next(err);
      console.log("deleted successfully: "+ emergencyAlert);
      res.json(emergencyAlert);
    }
  );
};
