var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var cors = require('cors');
var multer = require('multer');
var path = require('path');
var bodyParser = require('body-parser');
const config=require('./config/database');
var mongoose = require('mongoose');

app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended:true,limit:'50mb'}));


var user = require('./routes/user');

app.use(function (req, res, next) { 
  console.log(req.url +' '+ new Date());
  next();
});
app.use('/user',user);

app.use(express.static(path.join(__dirname, '')));




mongoose.connect(config.database);

mongoose.set('debug', true);

mongoose.connection.on('connected',function(){
  console.log('connected to database'+config.database)
});

mongoose.connection.on('error',function(a){
  console.log('Error' + a);
});





app.listen(4040);
console.log("running on 4040")


