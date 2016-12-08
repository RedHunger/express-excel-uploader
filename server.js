var express = require('express');
var app = express();
var router = require('./routes/index');

app.use('/', router);

app.listen(8000);
console.log("Go to server");
console.log("-------------------");

module.exports = app;
