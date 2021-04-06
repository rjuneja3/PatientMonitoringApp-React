const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    patientEntity: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    bodyTemp: {
      type: Number,
      required: "Body temprature is required",
    },
    heartRate: {
      type: Number,
      required: "Heart rate is required",
    },
    bloodPressure: {
      type: Number,
      required: "Blood pressure is required",
    },
    respiratoryRate: {
      type: Number,
      required: "Respiratory rate is required",
    },
    weight: {
        type: Number,
        required: "Weight is required",
      }
   
  }
);
mongoose.model('Report', ReportSchema);
