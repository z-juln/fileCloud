const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const port = 8901
const filename_path = path.join(__dirname,'./public/files')
const objMulter = multer({dest: filename_path})

const app = express()
app.use('', express.static(path.join(__dirname,'./public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, './index.html'))
})
.post('/upload', objMulter.any(), async (req,res) => {
  const file = req.files[0]
  const filename = file.originalname
  const newPath = path.join(filename_path, filename)
  fs.rename(file.path, newPath, (err) => {
      if(err){
          res.send({
            msg: 'fail'
          })
      }
      res.send({
        msg: 'ok'
      })
  })
})
.get('/file-list', async (req,res) => {
  fs.readdir(filename_path, {encoding: 'utf-8', widthFileTypes: true}, (err,data) => {
    res.send(data)
  })
})
.get('/download', async (req,res) => {
  const filename = req.query.filename
  res.download(path.join(filename_path,filename))
})
.get('/del-file', async (req,res) => {
  const filename = req.query.filename
  fs.unlink(path.join(filename_path, filename), (err) => {
    if(err) {
      res.send({
        msg: 'fail'
      })
    }
    res.send({
      msg: 'ok'
    })
  })
})
app.listen(port, () => {
  console.log(`server is running, port: ${port}`)
})
