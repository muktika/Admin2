var express = require('express'),
    app = express();

// // Synchronous
// var auth = express.basicAuth('testUser', 'testPass');

// // Synchronous Function
// var auth = express.basicAuth(function(user, pass) {
//  return user === 'testUser' && pass === 'testPass';
// });

// // Asynchronous
// var auth = express.basicAuth(function(user, pass, callback) {
//  var result = (user === 'testUser' && pass === 'testPass');
//  callback(null /* error */, result);
// });

// app.get('/abc', auth, function(req, res) {
//  res.send('Hello World');
// });

// app.get('/noAuth', function(req, res) {
//  res.send('Hello World - No Authentication');
// });

app.use(express.static(__dirname + '/app'));

app.use(function(req, res) {
    // Use res.sendfile, as it streams instead of reading the file into memory.
    res.sendFile(__dirname + '/app/index.html');
});

var server = app.listen(7000, function() {
  console.log('Listening on port %d', server.address().port);
});