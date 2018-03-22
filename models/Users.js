var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	USER_ID:String,
	USER_PW:String,
	USER_NM:String,
	CONFIRM_YN:{type:String, default:'Y'},
	REG_DT:{type:Date, default:Date.now}
});
module.exports = mongoose.model('user', UserSchema);