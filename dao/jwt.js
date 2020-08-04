let jwt = require("jsonwebtoken");
let secret = 'asdasdzxcasd' //随意
// 生成token
exports.generateToken = ( id, res ) => {
  let payload = {
    id,
    time: new Date()
  };
  
  let token = jwt.sign(payload, secret, {
    expiresIn: 60 * 60 * 24 * 120 //保存时间
  })
  return token
}

exports.verifyToken = (e) => {
  let payload;
  jwt.verify(e, secret, (err, result) => {
    if(err) {
      payload = 0
    }else {
      payload = 1
    }
  })

  return payload
}