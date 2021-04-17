const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyTipSchema = new Schema(
    {
        subject:{
            type: String,
            trim:true,
            required : "Please Enter the subject"
        },
        tipMessage : {
            type : String,
            trim:true,
            required : "Please enter the Daily tip message"
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

    },{timestamps:true}
    );
    mongoose.model('DailyTip',dailyTipSchema);