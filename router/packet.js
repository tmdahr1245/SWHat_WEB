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
		//시간 줄이려면 stream을 전역으로 선언하고 프랜들리 로그파싱 후 파일 읽은후 여기서는 읽은 파일 토대로 parser.on만 실행
		//stream을 전역으로 선언하면 다중사용자에서는 stream이 하나니까 배열로 반들어서 접속자수 count하는 변수만들어서 배열하기
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