const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username:String,
	pwd:String,
	scope:{ type: Array, default: ['USER'] },
	createTime:{type:String,default:Date.now()},
	tel:String,
	headImg:String,
	
});

const AdminSchema = new Schema({
	username:String,
	pwd:String,
	scope:{ type: Array, default: ['ADMIN'] }
});

const PaintingSchema = new Schema({
	name:String,
	url:String,
	other:[String]
});

const AccessRecordSchema = new Schema({
	guid:{ type: String, default: Date.now() }
});

module.exports = {
	Paint    	:   	mongoose.model('Painting',PaintingSchema),
	User   		: 		mongoose.model('User',UserSchema),
	Admin 		: 		mongoose.model('Admin',AdminSchema),
	AccessRecord: 		mongoose.model('AccessRecord',AccessRecordSchema)
}; 
