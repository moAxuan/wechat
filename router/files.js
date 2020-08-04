let multer = require('multer')
let mkdir = require("../dao/mkdir")
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let url = req.body.url
    mkdir.mkdirs(`../data/${url}`, err => {
      console.log(err)
    })
    cb(null, `./data/${url}`)
  },
  filename: (req, file, cb) => {
    let name = req.body.name
    let type = file.originalname.replace(/.+\./, ".")
    cb(null, name + type)
  },
})

let upload = multer({ storage });

module.exports = (app) => {
  app.post('/files/upload', upload.array('file', 10), (req, res, next) => {
    let url = req.body.url
    let name = req.files[0].filename
    let imgurl = '/' + url + '/' + name

    res.send(imgurl)
  })
}