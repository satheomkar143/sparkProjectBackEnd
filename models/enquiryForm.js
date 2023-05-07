var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  enquiryNo : {type:String, require:true},
  enquiryDate : {type:String, require:true},
  firstName : {type:String, require:true},
  middleName : {type:String, require:true},
  lastName : {type:String, require:true},
  contactNumber : {type:String, require:true},
  email : {type:String, require:true},
  nativePlace : {type:String, require:true},
  education : {type:String, require:true},
  stream : {type:String, require:true},
  marks : {type:String, require:true},
  collegeName : {type:String, require:true},
  collegeCity : {type:String, require:true},
  passOutYear : {type:String, require:true},
  technologyLearned : {type:String, require:true},
  coursesOrCertification : {type:String, require:true},
  sscPercentage : {type:String, require:true},
  hscPercentage : {type:String, require:true},
  graduationPercentage : {type:String, require:true},
  postGraduationPercentage : {type:String, require:true},
  academicGap : {type:String, require:true},
  anyQuery : {type:String, require:true},
  pending : {type:String, require:true}
})

module.exports = mongoose.model('enquiryForm',schema);