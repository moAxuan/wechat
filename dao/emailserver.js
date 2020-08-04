let nodemailer = require("nodemailer"); //引用发送邮箱插件
let credentials = require("../config/credentials")// 引入证书文件
// 创建传输方式
let transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: credentials.qq.user,
    pass: credentials.qq.pass
  }
})

exports.emailSignUp = (email, res) => {
  // 发送信息
  let options = {
    from: '799268416@qq.com',
    to: email,
    subject: '欢迎加入wechat大家庭', //标题
    html: '<span>热烈欢迎</span><a href="http://localhost:8080">gogogogo</a>',
  }
  // 创建发送
  transporter.sendMail(options, (err, msg) => {
    if(err)  return;
    res.send("okk")
    console.log('ok')
  })
}