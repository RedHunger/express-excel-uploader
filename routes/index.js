var express = require('express');
var router = express.Router();
var path = require('path');
var XLSX = require('xlsx');
var data = [];
var jsonData = [];
var testData = 0;
var forEach = require('lodash.foreach');

router.use('/*', express.static('public/index.html'));
router.use('/upload', fileUpload());
router.get('/list', function(req, res) {
    res.json(jsonData);
});
router.post('/upload', function(req, res) {
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
            browse: 'uppload/' + req.files.sampleFile["name"],
            sum: testData
        });

        jsonData = JSON.stringify(data);

        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');
            
        }
    });

});

router.get('/', function (req, res, next) {
    res.end("URL: " + req.url);
});



module.exports = router;