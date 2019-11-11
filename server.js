const express = require('express');
const router = require('./router/main');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

var server = app.listen(3000, '0.0.0.0', function () {
	console.log("Express server has started on port 3000")
});

router(app);
