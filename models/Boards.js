var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BoardSchema = new Schema({
	GRP_CD:String,
	USER_ID:String,
	USER_NM:String,
	READ_CNT:{type:Number, default: 0},
	REG_DT:{type:Date, default:Date.now},
	EDIT_DT:{type:Date, default:Date.now},
	DEL_YN:{type:Boolean, default:false},
	TITLE:String,
	CONTENT:String,
	COMMENTS:[{
		C_USER_ID:String,
		C_USER_NM:String,
		COMMENT:String,
		REG_DT:{type:Date,default: Date.now}
	}],
	COMMENTS_CNT:{type:Number, default:0},
	FILES:[{
		FILE_PATH:String,
		FILE_NM:String,
		FILE_SIZE:String,
		FILE_MIMETYPE:String
	}],
	FILES_CNT:{type:Number, default:0}
});
module.exports = mongoose.model('board', BoardSchema);
