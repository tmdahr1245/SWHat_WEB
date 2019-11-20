const express = require('express');
const router = require('./router/main');
const websockify = require('node-websockify');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

websockify({
	source: ':8080',
	target: '127.0.0.1:5900'
});

var server = app.listen(3000, '0.0.0.0', function () {
	console.log("Express server has started on port 3000")
});

router(app);
