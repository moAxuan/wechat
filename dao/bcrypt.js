// 密码加密
let bcrypt = require('bcryptjs');
exports.encryption = (e) => {
  // 生成随机salt
  let salt = bcrypt.genSaltSync(10);

  // 生成hash密码
  let hash = bcrypt.hashSync(e, salt);
  return hash;
}

// 解密
exports.verification = (e, hash) => {
  let verif = bcrypt.compareSync(e, hash);
  return verif;
}