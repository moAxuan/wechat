let dbserver = require("../dao/dbserver");
// 获取好友列表
exports.getFriend = (req, res) => {
  let data = req.body
  dbserver.getUsers(data, res)
}
// 获取最后一条消息
exports.getLastMsg = (req, res) => {
  let data = req.body
  dbserver.getOneMsg(data, res)
}
// 获取未读数量
exports.unreadMsg = (req, res) => {
  let data = req.body
  dbserver.unreadMsg(data, res)
}


exports.updateMsg = (req, res) => {
  let data = req.body
  dbserver.updateMsg(data, res)
}


exports.getGroup = (req, res) => {
  let uid = req.body.uid
  dbserver.getGroup(uid, res)
}
// 获取最后一条消息
// exports.getGroupMsg = (req, res) => {
//   let gid = req.body.gid
//   dbserver.getGroupMsg(gid, res)
// }
// 获取未读数量
exports.getLastGroupMsg = (req, res) => {
  let gid = req.body.gid
  dbserver.getOneGroupMsg(gid, res)
}


exports.updateGroupMsg = (req, res) => {
  let gid = req.body
  dbserver.updateGroupMsg(data, res)
}
