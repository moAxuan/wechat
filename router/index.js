let dbserver = require("../dao/dbserver");
// 引入邮箱发送方法
var emailserver = require("../dao/emailserver");
let signup = require("../server/signup");
let signin = require("../server/signin");
let search = require("../server/search");
let user = require("../server/userdetial");
let friend = require("../server/friend");
let index = require("../server/index");
let chat = require("../server/chat");
module.exports = (app) => {
  app.post("/test", (req, res) => {
    dbserver.findUser(res);
  });
  // 邮箱测试
  app.post("/mail", (req, res) => {
    let mail = req.body.mail;
    emailserver.emailSignUp(mail, res);
  });

  // 注册页面
  app.post("/signup/add", (req, res) => {
    signup.signUp(req, res);
  });

  // 判断占用
  app.post("/signup/judge", (req, res) => {
    signup.judgeValue(req, res);
  });

  // 登录
  app.post("/signin/match", (req, res) => {
    signin.signIn(req, res);
  });
  // 搜索用户
  app.post("/search/user", (req, res) => {
    search.searchUser(req, res);
  });
  // 判断是否为好友
  app.post("/search/isfriend", (req, res) => {
    search.isFriend(req, res);
  });
  // 搜索群
  app.post("/search/group", (req, res) => {
    search.searchGroup(req, res);
  });
  // 判断是否在群
  app.post("/search/isgroup", (req, res) => {
    search.isGroup(req, res);
  });

  //用户详情
  app.post("/user/detial", (req, res) => {
    user.userDetial(req, res);
  });
  // 信息修改
  app.post("/user/update", (req, res) => {
    user.userUpdate(req, res);
  });
  // 备注
  app.post("/user/updatemarkname", (req, res) => {
    user.updateMarkName(req, res);
  });
  // 获取备注
  app.post("/user/getmarkname", (req, res) => {
    user.getMarkName(req, res);
  });
  // 申请好友
  app.post("/friend/applyfriend", (req, res) => {
    friend.applyFriend(req, res);
  });
  // 添加好友
  app.post("/friend/updatefriendstate", (req, res) => {
    friend.updateFriendState(req, res);
  });
  // 删除好友
  app.post("/friend/deletefriend", (req, res) => {
    friend.deleteFriend(req, res);
  });
  // 获取用户列表
  app.post("/index/getfriend", (req, res) => {
    index.getFriend(req, res);
  });
  // 获取last msg
  app.post("/index/getlastmsg", (req, res) => {
    index.getLastMsg(req, res);
	});

  app.post("/index/unreadmsg", (req, res) => {
    index.unreadMsg(req, res);
	});

  app.post("/index/updatemsg", (req, res) => {
    index.updateMsg(req, res);
	});


	app.post("/index/getgroup", (req, res) => {
    index.getGroup(req, res);
  });
  // 获取last msg
  app.post("/index/getlastgroupmsg", (req, res) => {
    index.getLastGroupMsg(req, res);
	});

  app.post("/index/updategroupmsg", (req, res) => {
    index.updateGroupMsg(req, res);
	});

  app.post("/index/updatemsg", (req, res) => {
    index.updateMsg(req, res);
	});
	
	app.post("/chat/msg", (req, res) => {
    chat.msg(req, res);
  });
  app.post("/chat/insertmsg", (req, res) => {
    chat.insertMsg(req, res);
  });
  // token测试
  app.post("/signin/test", (req, res) => {
    res.send("tokenisok");
  });
};
