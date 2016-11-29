var http = require('http');
var fs = require("fs");
var data = 'Update current file';

// Create a readable stream
var readerStream = fs.createReadStream('file.txt');
var writerStream = fs.createWriteStream('file.txt');
var server = http.createServer(function(req, res) {
    // Set the encoding to be utf8. 
    readerStream.setEncoding('UTF8');

    // Handle stream events --> data, end, and error
    readerStream.on('data', function(chunk) {
        data += chunk;
    });

    readerStream.on('end', function() {
        console.log(data);
    });

    readerStream.on('error', function(err) {
        console.log(err.stack);
    });

    writerStream.write(data,'UTF8');

    writerStream.on('finish', function() {
        console.log("Write completed.");
    });

    writerStream.on('error', function(err) {
        console.log(err.stack);
    });

});
server.listen(8000);
console.log("Go to server");