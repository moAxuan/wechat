let dbserver = require("../dao/dbserver");

exports.msg = (req, res) => {
  let data = req.body
  dbserver.msg(data, res)
}
exports.insertMsg = (req, res) => {
  let data = req.body
  dbserver.insertMsg(data.uid, data.fid, data.msg, data.type, res);
}