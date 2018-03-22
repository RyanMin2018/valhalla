var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProductsSchema = new Schema({
	PRD_NM:String,
	PRICE:Number,
	REG_ID:String,
	REG_DT:{type:Date, default:Date.now},
	FILES:[{
		FILE_PATH:String,
		FILE_NM:String,
		FILE_SIZE:String,
		FILE_MIMETYPE:String
	}]
});
module.exports = mongoose.model('products', ProductsSchema);