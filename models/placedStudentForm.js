var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  studentId : {type:String, require:true},
  PlacedDate : {type:String, require:true},
  companyName : {type:String, require:true},
  companyLocation : {type:String, require:true},
  position : {type:String, require:true},
  salary : {type:String, require:true}
})

module.exports = mongoose.model('placedStudent',schema);