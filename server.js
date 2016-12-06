var http = require('http'),
    fs = require("fs"),
    path = require('path');
    express = require('express'),
    fileUpload = require('express-fileupload');
    app = express(),
    router = require('./routes/index');


app.use('/', router);
module.exports = app;

app.listen(8000);
console.log("Go to server");
console.log("-------------------");



