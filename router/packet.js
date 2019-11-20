const JSONStream = require("JSONStream");
const url = require('url');
const fs = require('fs');

module.exports = function (req, res) {
	let timestamp = req.params.timestamp;
	let pid = req.params.pid;
	let urlParse = url.parse(req.url, true);
	let argument = urlParse.query;
	let packet_cnt = parseInt(argument.packetNum);
	let logfile = './upload/' + timestamp + '/' + pid + "/log/socket.json"
	let packet;
	let stream = fs.createReadStream(logfile, { encoding: 'binary' }),
		parser = JSONStream.parse();
	stream.pipe(parser);
	parser.on('data', function (obj) {
		process_name = obj.name;
		let i = 0, j = 0, cnt = 0;
		while (obj[i] != undefined) {
			j = 0;
			while (obj[i].packet[j] != undefined) {
				if (cnt == packet_cnt) {
					packet = obj[i].packet[j].buf;
					i = -2;
					res.render('packet', {
						packet: packet
					});
					break;
				}
				cnt++;
				j++;
			}
			i++;
		}
	});
};