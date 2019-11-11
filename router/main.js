const multer = require('multer');

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

	app.get('/', index);
	app.get('/analysis', analysis);
	app.get('/result/:timestamp/:pid', result);
	app.get('/download/:timestamp/:pid/:filename', download);
	app.get('/packet/:timestamp/:pid', packet);
	app.post('/create', upload.array('userFile', 1), create);
}