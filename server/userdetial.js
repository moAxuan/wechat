let dbserver = require("../dao/dbserver");

// 详情
exports.userDetial = (req, res) => {
  let id = req.body.id
  dbserver.userDetial(id, res)
}
// 更新用户信息
exports.userUpdate = (req, res) => {
  let data = req.body
  dbserver.userUpdate(data, res)
}
// 备注好友
exports.updateMarkName = (req, res) => {
  let data = req.body
  dbserver.updateMarkName(data, res)
}
exports.getMarkName = (req, res) => {
  let data = req.body
  dbserver.friendMarkName(data, res)
}