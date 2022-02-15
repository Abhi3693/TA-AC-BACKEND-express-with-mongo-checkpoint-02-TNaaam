let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let categorySchema = new Schema({
  event_category: String,
  likes:{type:Number, default:0},
  events:[{type:Schema.Types.ObjectId, ref:"Event"}],
}, {timestamps:true});

let Category = mongoose.model("Category", categorySchema);

// Category.findOrCreate(name, updateProps = {}) => {
//   // Find
//   // else create
//   retun
// }

module.exports = Category;