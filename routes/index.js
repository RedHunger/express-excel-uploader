var express = require('express');
var router = express.Router();
var XLSX = require('xlsx');
var path = require('path');
var forEach = require('lodash.foreach');
var _ = require('lodash');
var bodyParser  = require('body-parser');
var fileUpload = require('express-fileupload');
var firebase = require('firebase');
var admin = require("firebase-admin");
var jsondata = [];
var setValueData = 0;
var data = [ {fileName: "file.txt", date: Date.now()},{fileName: "text.txt", date: Date.now()}];
var serviceAccount = require(path.join(__dirname,"/../express-upload-db-firebase-adminsdk-0xyvq-6ce9c46535.json"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://express-upload-db.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("restricted_access/secret_document");
var usersRef = ref.child("First User");

function getDB () {
    ref.once("value", function (snapshot) {
        jsonData = snapshot.val()
        console.log("db:"+ jsonData);
    });
}
getDB();

router.use(bodyParser.urlencoded());
router.use(bodyParser.json());

router.use(express.static('public'));
router.use('/static', express.static('public/index.html'));
router.post('/info', function(req, res) {
    res.json(data);
});

router.post('/add', function(req, res){

    data.push({
        fileName: req.body.fileName,
        date: req.body.fileTimeStamp,

    });

    jsonData = JSON.stringify(data);
    res.send(req.body);
});

router.use(fileUpload());
router.post('/upload',function (req, res) {

    // console.log('I am here');
    console.log(req.files);
    if (!req.files) {
        res.status(400).send('No files were uploaded.');
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
        function setValueDB (input) {
            forEach(input, function(value, key) {
                if(key.charAt(0) === column){
                    if(typeof(value.v) === 'number'){
                        setValueData += value.v
                    }
                }
            });
        }

        searchColumn(inputData);
        setValueDB(inputData);

        data.push({
            name: req.files.sampleFile["name"],
            TimeStamp: 0,
            sum: setValueData
        });

        usersRef.push(
            {
                name: req.files.sampleFile["name"],
                sum: setValueData
            }
        ).then(function (err, result) {
            getDB();
        });


        console.log(data);
        jsonData = JSON.stringify(data);


        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');

        }
    });
} );


router.get('/', function (req, res, next) {
    res.end("URL: " + req.url);
});



module.exports = router;