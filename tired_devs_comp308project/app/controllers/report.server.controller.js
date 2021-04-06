const mongoose = require("mongoose");

const Report = mongoose.model("Report");
const User = mongoose.model("User");

function getErrorMessage(err) {
  if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return "Unknown server error";
  }
}

exports.create = function (req, res) {
  const report = new Report();
  report.bodyTemp = req.body.bodyTemp;
  report.pulseRate = req.body.heartRate;
  report.bloodPressure = req.body.bloodPressure;
  report.respiratoryRate = req.body.respiratoryRate;
  report.weight = req.body.weight;

  var user_ent = new User();

  User.findOne({ username: req.body.patient }, (err, user) => {
    if (err) {
      return getErrorMessage(err);
    }
    if (!user) {
      res.json({ messgae: "User not found" });
    }
//    console.log("user found: " + user);
user_ent._id = user._id;
    //req._id = user._id;
  }).then(function () {
    report.patientEntity = user_ent._id;

    report.save((err) => {
      if (err) {
        return res.status(400).send({ message: getErrorMessage(err) });
      } else {
        res.status(200).json(report);
      }
    });
  });
};
// LIST OF ALL REPORTS SORTED BY TIME
exports.list = function (req, res) {
    Report.find()
    .sort("-patient")
    .sort("-createdAt")
    .exec((err, report) => {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err),
        });
      } else {
        return res.status(200).json(report);
      }
    });
};

exports.reportByID = function (req, res, next, id) {
  Report.findById(id).exec((err, report) => {
    if (err) return next(err);
    if (!report) return next(new Error("Failed to load daily Info " + id));
    req.report = report;
    req.reportId = report._id;
    next();
  });
};

exports.reportsOfPatient = function (req, res) {
  var user = new User();
  User.findOne({ _id: req.params.patientId }, (err, patient) => {
    if (err) {
      res.status(400).send({ message: getErrorMessage(err) });
    }
    user._id = patient._id;
  }).then(function () {
    Report.find({ patientEntity: user._id })
      .sort('-createdAt')
      .populate("patient")
      .exec((err, reports) => {
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err),
          });
        } else {
          res.status(200).json(reports);
        }
      });
  });
};

exports.latestReportOfPatient = function(req,res,id){
  var user = new User();
  User.findOne({ _id: req.params.latestReportPatientId }, (err, patient) => {
    if (err) {
      res.status(400).send({ message: getErrorMessage(err) });
    }
    if(!patient){
      console.log("patient not found")
    }
    user._id = patient._id;
    console.log("patient Id: " + user._id);
  }).then(function () {
    Report.findOne({ patientEntity: user._id })
      .sort('-createdAt')
      .populate("patient")
      .exec((err, reports) => {
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err),
          });
        } else {
          if(!reports){
            res.status(200).send({message: "No reports found"});
          }
          else{
          res.status(200).json(reports);
          }
        }
      });
  });
};

exports.hasAuthorization = function (req, res, next) {
  if (!req.report.patientEntity === req.user._id) {
    return res.status(403).send({
      message: "User is not authorized",
    });
  }
  next();
};

exports.read = function (req, res) {
  res.status(200).json(req.report);
};

exports.update = function (req, res) {
  Report.findOneAndUpdate(
    { _id: req.reportId },
    req.body,
    function (err, report) {
      if (err) return next(err);
      res.json(report);
    }
  );
};

exports.delete = function (req, res) {
  Report.findOneAndRemove(
    { _id: req.reportId },
    req.body,
    function (err, report) {
      if (err) return next(err);
      res.json(report);
    }
  );
};
