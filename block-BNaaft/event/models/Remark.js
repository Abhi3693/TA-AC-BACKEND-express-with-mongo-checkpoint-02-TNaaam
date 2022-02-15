let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let remarkSchema = new Schema({
  title:{type:String},
  author:{type:String},
  likes:{type:Number, default:0},
  events:{type:Schema.Types.ObjectId, ref:"Event"},
}, {timestamps:true});

let Remark = mongoose.model("Remark", remarkSchema);

module.exports = Remark;