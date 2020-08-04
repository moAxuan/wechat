let dbserver = require("../dao/dbserver");

// 用户搜索
exports.searchUser = (req, res) => {
  let data = req.body.data
  dbserver.searchUser(data, res)
}

exports.isFriend = (req, res) => {
  let { uid, fid } = req.body
  dbserver.isFriend(uid, fid, res)
}

exports.searchGroup = (req, res) => {
  let data = req.body.data
  dbserver.searchGroup(data, res)
}
exports.isGroup = (req, res) => {
  let { uid, gid } = req.body
  dbserver.isGroup(uid, gid, res)
}