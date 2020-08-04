let dbserver = require("../dao/dbserver");
// let jwt = require("../dao/jwt");
exports.signIn = ( req, res ) => {
  let { data, pwd } = req.body
  dbserver.userMatch(data, pwd, res)
}
