var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var schema = new Schema({
    OTP : {type:String, require:true},
    SecurityCode: {type:String, require:true},
    userName:{type:String, require:true},
    counter:{type:String, require:true},
    prevMonth: {type:String, require:true},
    enquiryNo: {type:String, require:true}
});

schema.statics.hashPassword = function hashPassword(OTP){
    return bcrypt.hashSync(OTP,10);
}

schema.statics.isValid = function isValid(OTP, userOtp){
    console.log("in isvalid" , OTP, userOtp)
    return  bcrypt.compareSync(userOtp, OTP);
}



module.exports = mongoose.model('security',schema);