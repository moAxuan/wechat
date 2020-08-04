let dbserver = require("../dao/dbserver");

exports.applyFriend = (req, res) => {
  let data = req.body
  dbserver.applyFriend(data, res)
}
// 更新好友状态
exports.updateFriendState = (req, res) => {
  let data = req.body
  dbserver.updateFriendState(data, res)
}
// 删除好友

exports.deleteFriend = (req, res) => {
  let data = req.body
  dbserver.deleteFriend(data, res)
}