var express = require('express');
var router = express.Router();
var path = require('path');
var multer  = require('multer');
var bodyParser  = require('body-parser');
var firebase = require('firebase');
var admin = require("firebase-admin");
var jsonData;
var serviceAccount = require(path.join(__dirname,"/../express-upload-db-firebase-adminsdk-0xyvq-6ce9c46535.json"));
var storage = multer.diskStorage({
    destination: './upload',
    filename: function (req, file, cb) {
        cb(null, "excel_file" + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });

// var upload = multer({ dest: './upload' });

router.use(bodyParser.urlencoded());
router.use(bodyParser.json());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://express-upload-db.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("restricted_access/secret_document");
var usersRef = ref.child("files");

function getDB () {
    ref.once("value", function (snapshot) {
        jsonData = snapshot.val();
    });
}
getDB();

router.use(express.static('public'));
router.use('/static', express.static('public/index.html'));
router.post('/info', function(req, res) {
    res.send(jsonData);
});

router.post('/add', function(req, res){
    res.send(req.body);
});


router.post('/upload', upload.array('file[]'), function (req, res) {
    var uploadedFile;
    uploadedFile = req.files[0];

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    usersRef.push(
        {
            name: uploadedFile.originalname,
            size:  uploadedFile.size + 'kb',
        }
    ).then(function (err, result) {
        getDB();
    });


    res.send(req.files);

} );


router.get('/', function (req, res, next) {
    res.end("URL: " + req.url);
});



module.exports = router;