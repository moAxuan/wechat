let mongoose = require('mongoose');

let db = mongoose.createConnection('mongodb://localhost:27017/wechat', { useFindAndModify: false,useNewUrlParser: true, useUnifiedTopology: true });


module.exports = db;