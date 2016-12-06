var express = require('express');
var router = express.Router();
var path = require('path');
router.use('/*', express.static('public/index.html'));
router.use('/upload', fileUpload());
router.post('/upload', function(req, res) {
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



        }
    });

});

router.get('/', function (req, res, next) {
    res.end("URL: " + req.url);
});



module.exports = router;