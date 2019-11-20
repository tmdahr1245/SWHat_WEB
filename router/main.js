const multer = require('multer');
const net = require('net');
const url = require('url');

const download = require('./download');
const result = require('./result');
const analysis = require('./analysis');
const packet = require('./packet');
const create = require('./create');
const index = require('./index');

module.exports = function (app) {
	let storage = multer.diskStorage({
		destination: function (req, file, callback) {
			callback(null, "./upload");
		},
		filename: function (req, file, callback) {
			callback(null, file.originalname);
		}
	});

	let upload = multer({
		storage: storage
	});
	var cli;
	app.get('/', index);
	app.get('/analysis', analysis);
	app.get('/result/:timestamp/:pid', result);
	app.get('/download/:timestamp/:pid/:filename', download);
	app.get('/packet/:timestamp/:pid', packet);
	app.get('/finish', function (req, res) {

		let urlParse = url.parse(req.url, true);
		let argument = urlParse.query;
		let timestamp = argument.timestamp;
		var writeData = function (socket, data) {
			var success = socket.write(data);
			if (!success) {
				console.log("Client Send Fail");
			}
			else {
				console.log("Send to Client Finish Signal");
			}
		}
		server = net.createServer(function (client) {
			console.log('Client connected');
			client.on('data', function (data) {
				console.log('Client sent ' + data.toString());
				res.redirect('/analysis?timestamp=' + timestamp);
				//종료하고 스냅샷 돌리기
			});
			client.on('end', function () {
				console.log('Client disconnected');
			});
			client.on('error', (e) => {
				console.log(e);
			});
		});

		server.listen(8815, function () {
			console.log('Server listening for connections');
		});
		writeData(cli, "1");
	});
	app.get('/spice', function (req, res) {
		let urlParse = url.parse(req.url, true);
		let argument = urlParse.query;
		let timestamp = argument.timestamp;
		let filename = argument.filename;

		var writeData = function (socket, data) {
			var success = socket.write(data);
			if (!success) {
				console.log("Client Send Fail");
			}
		}
		server = net.createServer(function (client) {
			cli = client;
			console.log('Client connected');
			client.write(timestamp + " " + filename);

			res.render('spice', {
				timestamp: timestamp,
				filename: filename,
				server: server,
				net: net
			});
			client.on('data', function (data) {
				console.log('Client sent ' + data.toString());
				writeData(client, 'Sending: ' + data.toString());
			});
			client.on('end', function () {
				console.log('Client disconnected');
			});
			client.on('error', (e) => {
				console.log(e);
			});
		});

		server.listen(8814, function () {
			console.log('Server listening for connections');
		});
	});
	app.post('/create', upload.array('userFile', 1), create);
}