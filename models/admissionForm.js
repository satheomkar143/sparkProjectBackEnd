var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  studentId : {type:String, require:true},
  admissionDate: {type:String, require:true},
  firstName:{type:String, require:true},
  middleName:{type:String, require:true},
  lastName:{type:String, require:true},
  DOB:{type:String, require:true},
  gender:{type:String, require:true},
  currentState:{type:String, require:true},
  currentDistrict:{type:String, require:true},
  currentCity:{type:String, require:true},
  permanentState:{type:String, require:true},
  permanentDistrict:{type:String, require:true},
  permanentCity:{type:String, require:true},
  personalNumber:{type:String, require:true},
  parentNumber:{type:String, require:true},
  email:{type:String, require:true},
  degree:{type:String, require:true},
  stream:{type:String, require:true},
  percentage:{type:String, require:true},
  collegeName:{type:String, require:true},
  university:{type:String, require:true},
  passOutYear:{type:String, require:true},
  backlogs:{type:String, require:true},
  underGraduated:{type:String, require:true},
  highestQualification:{type:String, require:true},
  sscPercentage:{type:String, require:true},
  hscPercentage:{type:String, require:true},
  anyOtherCourses:{type:String, require:true},
  course:{type:String, require:true},
  feesAllowed:{type:String, require:true},
});


module.exports = mongoose.model('admissionForm',schema);