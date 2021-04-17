const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DailyReportSchema = new Schema(
  {
    bodyTemprature: {
      type: Number,
      required: "Body temprature is required",
    },
    pulseRate: {
      type: Number,
      required: "pulse rate is required",
    },
    systolicBloodPressure: {
      type: Number,
      required: "systolic blood pressure is required",
    },
    diastolicBloodPressure: {
      type: Number,
      required: "Diastolic blood pressure is required",
    },
    respiratoryRate: {
      type: Number,
      required: "Respiratory rate is required",
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

mongoose.model("DailyReport", DailyReportSchema);
