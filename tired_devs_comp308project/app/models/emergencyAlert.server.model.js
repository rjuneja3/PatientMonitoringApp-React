const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emergencyAlertSchema = new Schema(
    {
        alertMessage: {
            type: String,
            required: "Alert Message is Required",
            trim: true
        },
        unread: {
            type: Boolean,
            default: true,
        },
        patient: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

},{timestamps:true},
);

mongoose.model('EmergencyAlert',emergencyAlertSchema);