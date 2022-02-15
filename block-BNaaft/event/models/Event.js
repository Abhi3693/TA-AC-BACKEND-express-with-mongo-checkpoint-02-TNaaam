let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let eventSchema = new Schema({
  title:{type:String, required:true},
  summary:{type:String},
  host:{type:String},
  start_date: Date,
  end_date: Date,
  category:{type:Schema.Types.ObjectId, ref:"Category"},
  location:String,
  likes:{type:Number, default:0},
  remarks:[{type:Schema.Types.ObjectId, ref:"Remark"}],
}, {timestamps:true});

let Event = mongoose.model("Event", eventSchema);

module.exports = Event;