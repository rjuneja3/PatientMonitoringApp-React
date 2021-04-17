const mongoose = require("mongoose");

const DailyReport = mongoose.model("DailyReport");
const User = mongoose.model("User");

//
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
  console.log("In Create");
  const dailyReport = new DailyReport();
  dailyReport.bodyTemprature = req.body.bodyTemprature;
  dailyReport.pulseRate = req.body.pulseRate;
  dailyReport.systolicBloodPressure = req.body.systolicBloodPressure;
  dailyReport.diastolicBloodPressure = req.body.diastolicBloodPressure;
  dailyReport.respiratoryRate = req.body.respiratoryRate;

  var usr = new User();
  console.log("req.body: " + req.body.patient);

  User.findOne({ username: req.body.patient }, (err, user) => {
    if (err) {
      return getErrorMessage(err);
    }
    if (!user) {
      res.json({ messgae: "User not found" });
    }
    console.log("user found: " + user);
    usr._id = user._id;
    //req._id = user._id;
  }).then(function () {
    dailyReport.patient = usr._id;

    console.log("dailyReport.patient: " + dailyReport.patient);

    dailyReport.save((err) => {
      if (err) {
        return res.status(400).send({ message: getErrorMessage(err) });
      } else {
        res.status(200).json(dailyReport);
      }
    });
  });
};

exports.list = function (req, res) {
  DailyReport.find()
    .sort("-patient")
    .sort("-createdAt")
    .exec((err, dailyReport) => {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err),
        });
      } else {
        console.log(dailyReport);
        return res.status(200).json(dailyReport);
      }
    });
};

exports.infoByID = function (req, res, next, id) {
  DailyReport.findById(id).exec((err, dailyReport) => {
    if (err) return next(err);
    if (!dailyReport) return next(new Error("Failed to load daily Info " + id));
    req.dailyReport = dailyReport;
    req.dailyReportId = dailyReport._id;
    next();
  });
};

exports.reportsOfPatient = function (req, res) {
  console.log("in infoByPatientId", req.params.patientId);
  var user = new User();
  User.findOne({ _id: req.params.patientId }, (err, patient) => {
    if (err) {
      res.status(400).send({ message: getErrorMessage(err) });
    }
    user._id = patient._id;
    console.log("patient Id: " + user._id);
  }).then(function () {
    DailyReport.find({ patient: user._id })
      .sort('-createdAt')
      .populate("patient")
      .exec((err, dailyReports) => {
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err),
          });
        } else {
          res.status(200).json(dailyReports);
        }
      });
  });
};

exports.latestReportOfPatient = function(req,res,id){
  console.log(id);
  console.log("in latestReportOfPatient", req.params.latestReportPatientId);
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
    DailyReport.findOne({ patient: user._id })
      .sort('-createdAt')
      .populate("patient")
      .exec((err, dailyReports) => {
        if (err) {
          return res.status(400).send({
            message: getErrorMessage(err),
          });
        } else {
          if(!dailyReports){
            console.log("!dailyreport");
            res.status(200).send({message: "No records found"});
          }
          else{
          res.status(200).json(dailyReports);
          }
        }
      });
  });
};

exports.hasAuthorization = function (req, res, next) {
  if (!req.dailyReport.patient === req.user._id) {
    return res.status(403).send({
      message: "User is not authorized",
    });
  }
  next();
};

exports.read = function (req, res) {
  res.status(200).json(req.dailyReport);
};

exports.update = function (req, res) {
  DailyReport.findByIdAndUpdate(
    req.dailyReportId,
    req.body,
    {useFindAndModify: false},
    function (err, dailyReport) {
      if (err) return next(err);
      res.json(dailyReport);
    }
  );
};

exports.delete = function (req, res) {
  DailyReport.findOneAndRemove(
    { _id: req.dailyReportId },
    req.body,{useFindAndModify: false},
    function (err, dailyReport) {
      if (err) return next(err);
      res.json(dailyReport);
    }
  );
};