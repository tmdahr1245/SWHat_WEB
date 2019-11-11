const fs = require('fs');
const JSONStream = require('JSONStream');
const url = require('url');

module.exports = function (req, res) {
	var pid = req.params.pid;
	var timestamp = req.params.timestamp;
	var process_name;
	var file = [];
	var process = [];
	var writememory = [];
	var connect = [];
	var createreg = [];
	var setvaluereg = [];
	var deletekeyreg = [];
	var deletevaluereg = [];
	var createservice = [];
	var startservice = [];
	var deleteservice = [];
	var controlservice = [];


	let urlParse = url.parse(req.url, true);
	let argument = urlParse.query;
	let parent = argument.parent;
	console.log(typeof pid);
	fs.stat('./upload/' + timestamp + '/' + pid, function (err) {
		if (!err) {
			console.log('file or directory exists');

			var fileParse = function () {
				return new Promise(function (resolve, reject) {
					var logfile = './upload/' + timestamp + '/' + pid + "/log/file.json"
					var stream = fs.createReadStream(logfile, { encoding: 'binary' }),
						parser = JSONStream.parse();

					stream.pipe(parser);
					parser.on('data', function (obj) {
						process_name = obj.name;
						var i = 0;
						while (obj[i] != undefined) {
							file.push([obj[i].name, obj[i].time, obj[i].length]);
							i++;
						}
						resolve('file parse finish');
					});
				});
			};
			var processParse = function () {
				return new Promise(function (resolve, reject) {
					var logfile = './upload/' + timestamp + '/' + pid + "/log/process.json"
					var stream = fs.createReadStream(logfile, { encoding: 'binary' }),
						parser = JSONStream.parse();

					stream.pipe(parser);
					parser.on('data', function (obj) {
						var i = 0;
						while (obj.createprocess[i] != undefined) {
							process.push([obj.createprocess[i].pid, obj.createprocess[i].imgName, obj.createprocess[i].cmdLine]);
							i++;
						}
						i = 0;
						while (obj.writememory[i] != undefined) {
							writememory.push([obj.writememory[i].pid, obj.writememory[i].baseAddress, obj.writememory[i].buf]);
							i++;
						}
						resolve('process parse finish');
					});
				});
			};
			var socketParse = function () {
				return new Promise(function (resolve, reject) {
					var logfile = './upload/' + timestamp + '/' + pid + "/log/socket.json"
					var stream = fs.createReadStream(logfile, { encoding: 'binary' }),
						parser = JSONStream.parse();

					stream.pipe(parser);
					parser.on('data', function (obj) {
						var i = 0;
						while (obj[i] != undefined) {
							connect.push(["socket", obj[i].ip, obj[i].port, obj[i].status]);
							if (obj[i].status === 'Success')
								var j = 0;
							while (obj[i].packet[j] != undefined) {
								connect[connect.length - 1].push([
									obj[i].packet[j].api,
									obj[i].packet[j].len,
									obj[i].packet[j].buf,
									obj[i].packet[j].time
								])
								j++;
							}
							i++;
						}
						resolve('socket parse finish');
					});
				});
			};
			var regParse = function () {
				return new Promise(function (resolve, reject) {
					var logfile = './upload/' + timestamp + '/' + pid + "/log/registry.json"
					var stream = fs.createReadStream(logfile, { encoding: 'binary' }),
						parser = JSONStream.parse();

					stream.pipe(parser);
					parser.on('data', function (obj) {
						var i = 0;
						while (obj[i] != undefined) {
							if (obj[i].mode == 'ck') {
								createreg.push([obj[i].time, obj[i].hive, obj[i].key]);
							}
							else if (obj[i].mode == 'sv') {
								setvaluereg.push([
									obj[i].time,
									obj[i].hive,
									obj[i].key,
									obj[i].value,
									obj[i].data
								]);
							}
							else if (obj[i].mode == 'dk') {
								deletekeyreg.push([obj[i].time, obj[i].hive, obj[i].key, obj[i].deldst]);
							}
							else if (obj[i].mode == 'dv') {
								deletevaluereg.push([obj[i].time, obj[i].hive, obj[i].key, obj[i].value]);
							}
							i++;
						}
						resolve('registry parse finish');
					});
				});
			};
			var serviceParse = function () {
				return new Promise(function (resolve, reject) {
					var logfile = './upload/' + timestamp + '/' + pid + "/log/service.json"
					var stream = fs.createReadStream(logfile, { encoding: 'binary' }),
						parser = JSONStream.parse();

					stream.pipe(parser);
					parser.on('data', function (obj) {
						var i = 0;
						while (obj[i] != undefined) {
							if (obj[i].mode == 'create') {
								createservice.push([
									obj[i].time,
									obj[i].ret,
									obj[i].serviceName,
									obj[i].BinaryPathName
								]);
							}
							else if (obj[i].mode == 'start') {
								startservice.push([obj[i].time, obj[i].serviceName]);
							}
							else if (obj[i].mode == 'delete') {
								deleteservice.push([obj[i].time, obj[i].serviceName]);
							}
							else if (obj[i].mode == 'control') {
								controlservice.push([obj[i].time, obj[i].serviceName, obj[i].status]);
							}
							i++;
						}
						resolve('service parse finish');
					});
				});
			};
			var logParse = async function () {
				console.log(await fileParse());
				console.log(await processParse());
				console.log(await socketParse());
				console.log(await regParse());
				console.log(await serviceParse());
				return 'all parse finish';
			}
			logParse().then(function (result) {
				console.log(result);
				res.render('index', {
					title: "다돌려",
					pid: pid,
					parent: parent,
					timestamp: timestamp,
					process_name: process_name,
					file_list: file,
					process_list: process,
					memory_list: writememory,
					connect_list: connect,
					createreg_list: createreg,
					setvaluereg_list: setvaluereg,
					deletekeyreg_list: deletekeyreg,
					deletevaluereg_list: deletevaluereg,
					createservice_list: createservice,
					startservice_list: startservice,
					deleteservice_list: deleteservice,
					controlservice_list: controlservice
				});
			});
		}
		else if (err.code === 'ENOENT') {
			console.log('file or directory does not exist');
			//res.status(401).send("unauthenticated")
			// res.send('<script type="text/javascript">alert("오류발생");</script>');
			res.write("<script language=\"javascript\">alert('64-bit process analysis is under preparation.')</script>");
			res.write(`<script language=\"javascript\">window.location=\"/result/${timestamp}/${parent}\"</script>`);

			//res.redirect(`/result/${timestamp}/${parent}`)
			
		}
	});
};