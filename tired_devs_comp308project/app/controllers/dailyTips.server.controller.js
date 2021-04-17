const mongoose = require("mongoose");

const DailyTip = mongoose.model("DailyTip");
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
  const dailyTip = new DailyTip();
  dailyTip.tipMessage = req.body.tipMessage;
  dailyTip.subject = req.body.subject;
  var usr = new User();
  console.log("req.body.author: " + req.body.author);
  if (req.body.author == "" || req.body.author == undefined) {
    return res.json({ messgae: "No user in request" });
  }
  User.findOne({ username: req.body.author }, (err, user) => {
    if (err) {
      return getErrorMessage(err);
    }
    if (!user || user == null || user == undefined) {
      return res.json({ messgae: "User not found" });
    }
    if (user.role !== "nurse") {
      return res.json({ message: "User do not have authorization" });
    }
    console.log("user found: " + user);
    usr._id = user._id;
    usr.role = user._role;
  }).then(function () {
    if (usr.role == "patient" || usr.role == undefined) {
      console.log("in then: ");
      dailyTip.author = usr._id;

      console.log("dailyTip.author: " + dailyTip.author);

      dailyTip.save((err) => {
        if (err) {
          return res.status(400).send({ message: getErrorMessage(err) });
        } else {
          res.status(200).json(dailyTip);
        }
      });
    }
  });
};

exports.list = function (req, res) {
  DailyTip.find()
    .sort("-createdAt")
    .populate("author")
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
  DailyTip.findById(id).exec((err, dailyTip) => {
    if (err) return next(err);
    if (!dailyTip) return next(new Error("Failed to load dailyTip " + id));
    req.dailyTip = dailyTip;
    req.tipId = dailyTip._id;
    next();
  });
};

exports.getLatestTip = function(req,res,next){
DailyTip.findOne().sort("-createdAt").populate('author').exec((err,tip)=>{
  if(err){
    console.log(err);
  }
  if(!tip){
    console.log("!dailyreport");
            res.status(200).send({message: "No records found"});
  }
  else{
    res.status(200).send(tip);
  }
});

};

exports.hasAuthorization = function (req, res, next) {
  if (!req.dailyTip.author === req.user._id) {
    return res.status(403).send({
      message: "User is not authorized",
    });
  }
  next();
};

exports.read = function (req, res) {
  // update read item
  res.status(200).json(req.dailyTip);
};

exports.update = function (req, res) {
    DailyTip.findByIdAndUpdate(req.tipId,req.body).exec((err,dailyTip)=>{
        if (err){
            return next(err);
        };
        console.log("updated successfully: " + dailyTip);
        res.json(dailyTip);
     });
};

exports.delete = function (req, res) {
 DailyTip.findByIdAndRemove(req.tipId).exec((err,dailyTip)=>{
    if (err){
        return next(err);
    };
    console.log("deleted successfully: " + dailyTip);
    res.json(dailyTip);
 });
};
