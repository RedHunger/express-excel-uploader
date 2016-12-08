var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
var forEach = require('lodash.foreach');
var _ = require('lodash');
var bodyParser  = require('body-parser');
var jsondata = [];
var data = [ {fileName: "file.txt", date: Date.now()},{fileName: "text.txt", date: Date.now()}];
var fileUpload = require('express-fileupload');

router.use(bodyParser.urlencoded());
router.use(bodyParser.json());

router.use(express.static('public'));
router.use('/static', express.static('public/index.html'));

router.use('/info', fileUpload());

router.post('/add', function(req, res){
    res.send(req.body);
});

router.post('/info',function (req, res) {

    var sampleFile;
    sampleFile = req.files;
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
    sampleFile = req.files.sampleFile;
    sampleFile.mv("./uppload/"+ req.files.sampleFile["name"], function(err) {

        var workbook = XLSX.readFile('./uppload/' + req.files.sampleFile["name"]);
        var inputData = workbook.Sheets.Лист1;
        var testData = 0;
        var column = '';
        function searchColumn(input){
            forEach(input, function(value, key){
                if (value.v === 'Стоимость') {
                    column = key.charAt(0);
                }
            })
        }
        function test (input) {
            forEach(input, function(value, key) {
                if(key.charAt(0) === column){
                    if(typeof(value.v) === 'number'){
                        testData += value.v
                    }
                }
            });
        }

        searchColumn(inputData);
        test(inputData);

        data.push({
            name: req.files.sampleFile["name"],
            TimeStamp: 0
        });

        jsonData = JSON.stringify(data);

        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');

        }
    });

    res.json(jsonData);
} );


router.get('/', function (req, res, next) {
    res.end("URL: " + req.url);
});



module.exports = router;