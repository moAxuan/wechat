let mongoose = require('mongoose');
let db = require('../config/db');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
	name: { type: String },                       //用户名
	psw: { type: String },                        //密码
	email: { type: String },                      //邮箱
	sex: { type: String, default: 'asexual'},     //性别
	brith: { type: Date },                        //生日
	phone: { type: Number },                      //电话
	explain: { type: String},                     //介绍
	imgurl: { type: String, default: '/user/user.png'}, //用户头像
	register: { type: Date, default:new Date() },                     //注册时间
});
//好友表
let FriendSchema = new Schema({
	
	userID: { type: Schema.Types.ObjectId, ref: 'User'},    //用户id
	friendID: { type: Schema.Types.ObjectId, ref: 'User'},  //好友id
	markname: { type: String},                    //备注
	state: { type: String },                       //申请状态 0为好友 ,1申请, 2未通过好友申请
	time: { type: Date },                        //生成时间
	lastTime: { type: Date }
});
//一对一消息表
let MessageSchema = new Schema({
	userID: { type: Schema.Types.ObjectId, ref: 'User'},    //用户id
	friendID: { type: Schema.Types.ObjectId, ref: 'User'},  //好友id
	message: { type: String },                       	   //消息
	types: { type: String },					 						//内容类型
	time: { type: Date },                        //发送时间
	state: { type: Number },                     //接受状态:0已读,1未读
});

//群表
let GroupSchema = new Schema({
	userID: { type: Schema.Types.ObjectId, ref: 'User'},    //用户id
	name: { type: String },                                //群名称
	imgurl: { type: String, default: 'group.png' },        //群头像
	time: { type: Date },                        //创建时间
	notice: { type: String },					 //公告
});

//群成员表
let GroupUserSchema = new Schema({
	groupID: { type: Schema.Types.ObjectId, ref: 'Group'},    //群id
	userID: { type: Schema.Types.ObjectId, ref: 'User'},  //用户id
	name: { type: String },                       	   //群内名称
	tip: { type: Number, default:0 },					//未读消息数
	time: { type: Date },                        		//加入时间
	lastTime: { type: Date },
	shield: { type: Number },                     		//是否屏蔽群消息:0屏蔽,1不屏蔽
});

//群消息表
let GroupMsgSchema = new Schema({
	groupID: { type: Schema.Types.ObjectId, ref: 'Group'},    //群id
	userID: { type: Schema.Types.ObjectId, ref: 'User'},  //用户id
	message: { type: String },                       	   //消息
	types: { type: String },					 //内容类型
	time: { type: Date },                        //发送时间
	state: { type: Number },                     //接受状态:0已读,1未读                		//是否屏蔽群消息:0屏蔽,1不屏蔽
});
module.exports = db.model('User', UserSchema);
module.exports = db.model('Friend', FriendSchema);
module.exports = db.model('Message', MessageSchema);
module.exports = db.model('Group', GroupSchema);
module.exports = db.model('GroupUser', GroupUserSchema);
module.exports = db.model('GroupMsg', GroupMsgSchema);