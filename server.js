var http = require('http'),
    fs = require("fs"),
    path = require('path');
    express = require('express'),
    fileUpload = require('express-fileupload');
    app = express(),
    data = 'Update current file';
    bodyParser = require('body-parser');
    handlebars = require('express-handlebars');

app.engine('handlebars', handlebars({extname:'handlebars', defaultLayout: 'layout', layoutsDir: __dirname + '/views/'}));
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/form', express.static(__dirname + '/upload.test.html'));
app.use(fileUpload());

app.post('/upload', function(req, res) {

    var sampleFile; 
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
    sampleFile = req.files.sampleFile;
    sampleFile.mv(__dirname +"/uppload/"+ req.files.sampleFile["name"], function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            fs.readdir(__dirname + "/uppload/", (err, files) => {
                files.forEach(file => {
                    res.render('layout',{title:'OK', anyArray : files});
                    console.log("Files:"+ file);
                });
            });

            // res.render('layout',{title:'OK', body :"File uploaded"});
        }
    });



});

app.use(function (req,res,next){
    res.send(404,"Sorry! Page not found");
});


console.log("Go to server");
console.log("-------------------");
app.listen(8000);

