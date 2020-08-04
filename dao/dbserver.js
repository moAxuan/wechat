let dbmodel = require("../model/dbmodel");
let jwt = require("../dao/jwt");
let bcrypt = require("../dao/bcrypt");
const { type } = require("os");
let User = dbmodel.model("User");
let Friend = dbmodel.model("Friend");
let Message = dbmodel.model("Message");
let Group = dbmodel.model("Group");
let GroupUser = dbmodel.model("GroupUser");
let GroupMsg = dbmodel.model("GroupMsg");
exports.bindUser = (name, mail, pwd, res) => {
  // 密码加密
  let password = bcrypt.encryption(pwd);
  let data = {
    name,
    email: mail,
    psw: password,
    time: new Date(),
  };

  let user = new User(data);

  user.save((err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};

// 匹配用户个数
exports.countUserValue = (data, type, res) => {
  let wherestr = {};
  wherestr[type] = data;
  User.countDocuments(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, result });
    }
  });
};
// 用户验证
exports.userMatch = (data, pwd, res) => {
  let wherestr = {
    $or: [{ name: data }, { email: data }],
  };
  let out = {
    name: 1,
    imgurl: 1,
    psw: 1,
  };
  User.find(wherestr, out, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      if (result == "") {
        res.send({ status: 400 });
      }
      //报错Cannot set headers after they are sent to the client 使用map会多次调用
      result.map((e) => {
        // const pwdMatch = bcrypt.verification(pwd, e.psw);
        const pwdMatch = bcrypt.verification(pwd, e.psw);
        if (pwdMatch) {
          let token = jwt.generateToken(e._id);
          let back = {
            id: e._id,
            name: e.name,
            imgurl: e.imgurl,
            token,
          };
          res.send({ status: 200, back });
        } else {
          res.send({ status: 400, message: "密码错误" });
        }
      });
    }
  });
};

exports.searchUser = (data, res) => {
  let wherestr;
  if (data == "wechat") {
    wherestr = {};
  } else {
    wherestr = {
      $or: [{ name: { $regex: data } }, { email: { $regex: data } }], //模糊搜索
    };
  }
  let out = {
    name: 1,
    email: 1,
    imgurl: 1,
  };
  User.find(wherestr, out, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, result });
    }
  });
};

// 判断是否为好友
exports.isFriend = (uid, fid, res) => {
  let wherestr = {
    userID: uid,
    friendID: fid,
    state: 0,
  };
  Friend.findOne(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      if (result) {
        res.send({ status: 200 });
      } else {
        res.send({ status: 400 });
      }
    }
  });
};

// 搜索群
exports.searchGroup = (data, res) => {
  let wherestr;
  if (data == "wechat") {
    wherestr = {};
  } else {
    wherestr = {
      $or: [{ name: { $regex: data } }], //模糊搜索
    };
  }
  let out = {
    name: 1,
    imgurl: 1,
  };
  Group.find(wherestr, out, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, result });
    }
  });
};

// 判断是否在群内
exports.isGroup = (uid, gid, res) => {
  let wherestr = {
    userID: uid,
    groupID: gid,
  };
  GroupUser.findOne(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      if (result) {
        res.send({ status: 200 });
      } else {
        res.send({ status: 400 });
      }
    }
  });
};

// 用户详情
exports.userDetial = (id, res) => {
  let wherestr = { _id: id };
  let out = { psw: 0 };
  User.findOne(wherestr, out, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, result });
    }
  });
};

function update(data, update, res) {
  User.findByIdAndUpdate(data, update, (err, resu) => {
    if (err) {
      // 修改失败
      res.send({ result: 500 });
    } else {
      // 修改成功
      res.send({ result: 200 });
    }
  });
}
// 用户修改
exports.userUpdate = (data, res) => {
  let updatestr = {};
  // 判断是否有密码项
  // res.send(data)
  if (typeof data.pwd != "undefined" && data.type != "name") {
    User.find({ _id: data.id }, { psw: 1 }, (err, result) => {
      if (err) {
        res.send({ status: 500 });
      } else {
        if (result == "") {
          res.send({ status: 400 });
        }
        //报错Cannot set headers after they are sent to the client 使用map会多次调用
        result.map((e) => {
          const pwdMatch = bcrypt.verification(data.pwd, e.psw);

          if (pwdMatch) {
            // 密码验证
            if (data.type == "psw") {
              // 密码加密
              let password = bcrypt.encryption(data.data);
              updatestr[data.type] = password;
              update(data.id, updatestr, res);
            } else {
              // 邮箱匹配
              updatestr[data.type] = data.data;
              User.countDocuments(updatestr, (err, result) => {
                if (err) {
                  res.send({ status: 500 });
                } else {
                  // 没有匹配项,可以修改
                  if (result == 0) {
                    update(data.id, updatestr, res);
                  } else {
                    res.send({ status: 300, message: "邮箱已存在" });
                  }
                }
              });
            }
          } else {
            // 密码匹配失败
            res.send({ status: 400, message: "原密码错误" });
          }
        });
      }
    });
  } else if (data.type == "name") {
    updatestr[data.type] = data.data;
    User.countDocuments(updatestr, (err, result) => {
      if (err) {
        res.send({ status: 500 });
      } else {
        // 没有匹配项,可以修改
        if (result == 0) {
          update(data.id, updatestr, res);
        } else {
          res.send({ status: 300, message: "用户已存在" });
        }
      }
    });
  } else {
    updatestr[data.type] = data.data;
    update(data.id, updatestr, res);
  }
};

// 修改好友昵称
exports.updateMarkName = (data, res) => {
  let wherestr = {
    userID: data.uid,
    friendID: data.fid,
  };
  let updatestr = {
    markname: data.name,
  };
  Friend.updateOne(wherestr, updatestr, (err, result) => {
    if (err) {
      // 修改失败
      res.send({ status: 500 });
    } else {
      // 修改成功
      res.send({ status: 200 });
    }
  });
};
exports.friendMarkName = (data, res) => {
  let wherestr = {
    userID: data.uid,
    friendID: data.fid,
  };

  Friend.findOne(wherestr,  (err, result) => {
    if (err) {
      // 修改失败
      res.send({ status: 500 });
    } else {
      // 修改成功
      res.send({ status: 200, result });
    }
  });
}
// 添加好友表
exports.buildFriend = (uid, fid, state, res) => {
  let data = {
    userID: uid,
    friendID: fid,
    state,
    time: new Date(),
    lastTime: new Date(),
  };
  let friend = new Friend(data);
  console.log(friend)
  friend.save((err, result) => {
    if (err) {
      // res.send({ status: 500 });
    } else {
      // console.log(result)
    }
  });
};

exports.upFriendLastTime = (data) => {
  let wherestr = {
    $or: [
      { userID: data.uid, friendID: data.fid },
      { userID: data.fid, friendID: data.uid },
    ],
  };
  let updatestr = { lastTime: new Date() };
  Friend.updateMany(wherestr, updatestr, (err, result) => {
    if (err) {
      console.log("通讯时间出错");
      // res.send({ status: 500 })
    } else {
      // res.send({ status: 200 })
    }
  });
};

// 添加一对一消息表
exports.insertMsg = (uid, fid, msg, type, res) => {
  let data = {
    userID: uid,
    friendID: fid,
    message: msg,
    types: type,
    time: new Date(),
    state: 1, //消息接受状态
  };
  let message = new Message(data);
  message.save((err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, result });
    }
  });
};

//好友申请
exports.applyFriend = (data, res) => {
  // 判断是否申请过
  let wherestr = { userID: data.uid, friendID: data.fid };
  Friend.countDocuments(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      // 初次申请
      console.log(result)
      if (result == 0) {
        
        this.buildFriend(data.fid, data.uid, 1);
        this.buildFriend(data.uid, data.fid, 2);
      } else {
        this.upFriendLastTime(data);
      }
      // 添加消息
      this.insertMsg(data.uid, data.fid, data.msg, data.type = 0, res);
    }
  });
};

// 更新好友
exports.updateFriendState = (data, res) => {
  let wherestr = {
    $or: [
      { userID: data.uid, friendID: data.fid },
      { userID: data.fid, friendID: data.uid },
    ],
  };
  Friend.updateMany(wherestr, { state: 0 }, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};

// 删除好友
exports.deleteFriend = (data, res) => {
  let wherestr = {
    $or: [
      { userID: data.uid, friendID: data.fid },
      { userID: data.fid, friendID: data.uid },
    ],
  };
  Friend.deleteMany(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};

// 获取用户列表
exports.getUsers = (data, res) => {
  let query = Friend.find({});
  query.where({ userID: data.uid, state: data.state });
  query.populate("friendID");
  query.sort({
    lastTime: -1,
  });
  query
    .exec()
    .then((e) => {
      let result = e.map((ver) => {
        return {
          id: ver.friendID._id,
          name: ver.friendID.name,
          markname: ver.markname,
          imgurl: ver.friendID.imgurl,
          lastTime: ver.lastTime,
          type: 0,
        };
      });
      res.send({ status: 200, result });
    })
    .catch((err) => {
      res.send({ status: 200, message: "获取用户失败" });
    });
};

// 按要求获取一对一消息
exports.getOneMsg = (data, res) => {


  let query = Message.findOne();
  query.where({
    $or: [
      { userID: data.uid, friendID: data.fid },
      { userID: data.fid, friendID: data.uid },
    ],
  });
  query.sort({
    time: -1,
  });
  query
    .exec()
    .then((ver) => {
      let result = {
        message: ver.message,
        types: ver.types,
        time: ver.time,   
      }
      // res.send({ status: 200, e })
      res.send({ status: 200, result });
    })
    .catch((err) => {
      // res.send({ status: 200, message: "获取用户失败" });
      console.log(err)
    });
};

// 未读数
exports.unreadMsg = (data, res) => {
  let wherestr = { userID: data.formid, friendID: data.toid, state: 1 };
  Message.countDocuments(wherestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200, result });
    }
  });
};

exports.updateMsg = (data, res) => {
  let wherestr = { userID: data.uid, friendID: data.fid, state: 1 };
  let updatestr = { state: 0 };
  console.log(data)
  Message.updateMany(wherestr, updatestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};

// 获取群列表
exports.getGroup = (id, res) => {
  let query = GroupUser.find({});
  query.where({ userID: id });
  query.populate("groupID");
  query.sort({
    lastTime: -1,
  });
  query
    .exec()
    .then((e) => {
      let result = e.map((ver) => {
        return {
          id: ver.groupID._id,
          name: ver.groupID.name,
          markname: ver.name,
          imgurl: ver.groupID.imgurl,
          lastTime: ver.lastTime,
          tip: ver.tip,
          type: 1,
        };
      });
      res.send({ status: 200, result });
    })
    .catch((err) => {
      res.send({ status: 200, message: "获取用户失败" });
    });
};
// 获取群消息
exports.getOneGroupMsg = (gid, res) => {
  let query = GroupMsg.findOne({});

  query.where({
    groupID: gid,
  });
  query.populate("groupID");
  query.sort({
    time: -1,
  });
  query
    .exec()
    .then((e) => {
      let result = {
        message: e.message,
        types: e.types,
        time: e.time,
        name: e.userID.name,
      };

      res.send({ status: 200, result });
    })
    .catch((err) => {
      res.send({ status: 200, message: "获取群列表失败" });
    });
};

exports.updateGroupMsg = (data, res) => {
  let wherestr = { userID: data.uid, groupID: data.gid };
  let updatestr = { tip: 0 };
  Message.updateOne(wherestr, updatestr, (err, result) => {
    if (err) {
      res.send({ status: 500 });
    } else {
      res.send({ status: 200 });
    }
  });
};

exports.msg = (data, res) => {
  var skipNum = data.nowPage * data.pageSize
  let query = Message.find({});
  query.where(
    {$or: [
      { userID: data.uid, friendID: data.fid },
      { userID: data.fid, friendID: data.uid },
    ]}
  );
  query.populate("userID");
  query.sort({
    time: -1,
  });
  query.skip(skipNum)
  query.limit(data.pageSize)
  query
    .exec()
    .then((e) => {
      let result = e.map((ver) => {
        return {
          id: ver._id,
          message: ver.message,
          time: ver.time,
          fromId: ver.userID._id,
          imgurl: ver.userID.imgurl,
          types: ver.types,
          state: ver.state
        };
      });
      res.send({ status: 200, result });
    })
    .catch((err) => {
      res.send({ status: 200, message: "获取用户失败" });
    });
}

