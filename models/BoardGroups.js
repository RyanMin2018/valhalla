var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BoardGroupSchema = new Schema({
	GRP_CD:String,
	GRP_NM:String,
	ORD:{type:Number, default: 0},
	ARTICLE_CNT:{type:Number, default:0},
	DEL_YN:{type:Boolean, default:false}
});
module.exports = mongoose.model('boardgroup', BoardGroupSchema);
