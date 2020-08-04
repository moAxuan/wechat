const express = require('express');
const app = express()
const port = 3000;
const bodyParser = require('body-parser');
let jwt = require("./dao/jwt");
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(bodyParser.json({limit: '50mb'}))
app.use(express.static(__dirname + '/data'))
app.use(require('cors')())


let server = app.listen(8082);
var io = require("socket.io").listen(server).sockets
require('./dao/socket')(io)
//设置允许跨域访问该服务.
// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header("Access-Control-Allow-Headers","Content-type,Content-Length,Authorization,Accept,X-Requested-Width");
//   res.header("X-Powered-By",' 3.2.1');
//   res.header('Content-Type', 'application/json;charset=utf-8');
//   if(req.method == "OPTIONS") {
//     res.status(200)
//   }else {
//     next();
//   }
  
// });

//token判断
app.use((req, res, next) => {
	if( typeof(req.body.token) != 'undefined' ) {
		let { token } = req.body
		let tokenMatch = jwt.verifyToken(token)
		if( tokenMatch === 1) {
			// 通过验证
			next();
		}else {
			// !通过
			res.send({ status: 300 })
		}
		
	}else {
		next()
	}
})

require('./router/index')(app)
require('./router/files')(app)

app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
})


app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send(err.message);
})

app.listen(port, () => console.log('ook'));