var express = require('express');
const path = require('path');
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
const creds = require('../config');

var transport = {
    host: 'smtp.gmail.com', // Don’t forget to replace with the SMTP host of your provider
    port: 587,
    auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {

  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var content = `name: ${name} \n email: ${email} \n message: ${message} `

  var mail = {
    from: name,
    to: 'likhitasuresh@gmail.com',  // Change to email address that you want to receive messages on
    subject: 'New Message from Contact Form in Portfolio',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
       status: 'success'
      })
    }
  })
})

const app = express()
app.use(express.static(path.join(__dirname, '/build')))
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://likhitasuresh.com');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // // Request headers you wish to allow
//   // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // // Set to true if you need the website to include cookies in the requests sent
//   // // to the API (e.g. in case you use sessions)
//   // res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });
app.use(express.json())
app.use('/', router)
// app.listen(3002)

app.get('*',  (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'))
})


app.listen(process.env.PORT, () => console.log("Listening on port"+process.env.PORT));