let dbserver = require("../dao/dbserver");
let email = require('../dao/emailserver') //发送邮件
// 用户注册
exports.signUp = (req, res) => {
  let { name, mail, pwd } = req.body
  // res.send({name,mail, pwd})
  email.emailSignUp(mail, res)
  dbserver.bindUser(name, mail, pwd, res)
}

// 用户/email被占用的判断
exports.judgeValue = (req, res) => {
  let { data, type } = req.body
  dbserver.countUserValue(data, type, res)
}