const JSONStream = require("JSONStream");
const mkdirp = require('mkdirp-promise');
const path = require('path');
const url = require('url');
const fs = require('fs');
const glob = require('glob-promise');
const filesize = require("filesize"); 


const connectfunc = new Array("connect", "WSAConnect", "ConnectEx");
const socketfunc = new Array("send", "sendto", "recv", "recvfrom", "WSARecv", "WSARecvFrom", "WSASend", "WSASendTo");
const socketclose = new Array("NtClose", "closesocket");
const regcreate = new Array("RegCreateKeyA", "RegCreateKeyW", "RegCreateKeyExA", "RegCreateKeyExW");
const regopen = new Array("RegOpenKeyA", "RegOpenKeyW", "RegOpenKeyExA", "RegOpenKeyExW");
const regsetvalue = new Array("RegSetValueA", "RegSetValueW", "RegSetValueExA", "RegSetValueExW");
const regsetkeyvalue = new Array("RegSetKeyValueA", "RegSetKeyValueW");
const regdeletekey = new Array("RegDeleteKeyA", "RegDeleteKeyW", "RegDeleteKeyExA", "RegDeleteKeyExW");
const regdeletevalue = new Array("RegDeleteValueA", "RegDeleteValueW", "RegDeleteKeyValueA", "RegDeleteKeyValueW");
const servicecreate = new Array("CreateServiceA", "CreateServiceW", "OpenServiceA", "OpenServiceW");
const servicestart = new Array("StartServiceA", "StartServiceW");
const urldown = new Array("URLDownloadToFileA", "URLDownloadToFileW");

function check_list(value, list) {
	for (let i = 0; i < list.length; i++) {
		if (list[i] == value) return true;
	}
	return false;
}
function get_hive(hive) {
	hive = parseInt(hive)
	if (hive == 0x80000000) return "HKEY_CLASSES_ROOT";
	else if (hive == 0x80000001) return "HKEY_CURRENT_USER";
	else if (hive == 0x80000002) return "HKEY_LOCAL_MACHINE";
	else if (hive == 0x80000003) return "HKEY_USERS";
	else if (hive == 0x80000005) return "HKEY_CURRENT_CONFIG";
	return null;
}
module.exports = async function (req, res) {
	console.log('get analysis')
	let urlParse = url.parse(req.url, true);
	let argument = urlParse.query;
	let timestamp = argument.timestamp;
	console.log("timestamp : " + timestamp);
	const files = await glob("wanna/*.json");
	fs.copyFileSync('wanna/info.json', `upload/${timestamp}/info.json`)
	console.log(files)

	const promises = files.map(async file => {
		let logfile = file;
		if(logfile === "wanna/info.json"){
			return new Promise((resolve, reject) => {resolve()})
		}
		console.log(logfile);
		var stats = fs.statSync(logfile)
		var fileSizeInMb = filesize(stats.size, {round: 0});
		
		if(fileSizeInMb === "0 B"){
			console.log("0byte")
			return new Promise((resolve, reject) => {resolve()})
		}
		let stream = await fs.createReadStream(logfile, { encoding: 'binary' }),
			parser = await JSONStream.parse();
		stream.pipe(parser);

		let urldownload = [];
		let pid, process_name;

		let file_json = {};
		let file_cnt = 0;
		let process_json = {};
		let createprocess_cnt = 0;
		let writememory_cnt = 0;
		process_json.createprocess = {};
		process_json.writememory = {};
		let socket_json = {};
		let socket_cnt = 0;
		let packet_cnt = 0;
		let registry_json = {};
		let registry_cnt = 0;
		let service_json = {};
		let service_cnt = 0;

		return new Promise((resolve, reject) => {
			const res = parser.on('data', function (obj) {
				log = obj['log'];
				pid = obj['pid'];
				process_name = obj['process'];
				file_json.name = obj['process'];
				let logPath = './upload/' + timestamp + '/' + String(pid) + '/file';
				console.log('logPath test', logPath)

				mkdirp(logPath).then(async res => {
					console.log('mkdirp test: ', res)

					for (let i = 0; i < log.length; i++) {
						if (log[i].api === 'NtCreateFile') {
							let flag = false;
							let drop_file, file_length;
							if ((parseInt(log[i].AccessMask) & 0x40000000) && !parseInt(log[i].ret)) {
								for (let j = i + 1; j < log.length; j++) {
									if (log[j].api === 'NtWriteFile') {
										if (log[j].FileHandle == log[i].FileHandle && !parseInt(log[j].ret)) {
											if (!flag) {

												drop_file = await fs.createWriteStream(
													path.join(__dirname + "/../upload/" + timestamp + '/' + String(pid) + '/file',
														path.basename(log[i].FileName.replace(/\\/gi, '/'))),
													{ encoding: 'binary' }
												);
												file_length = 0;
											}
											flag = true;
											drop_file.write(log[j].Buffer);
											file_length += parseInt(log[j].Length);
										}
									}
									else if (log[j].api === 'NtClose' || log[j].api === 'MyNtClose') {
										if (log[i].FileHandle == log[j].Handle) {
											if (flag) {
												drop_file.end();
												file_json[file_cnt++] = { name: log[i].FileName, time: log[i].time, length: file_length};
											}
											break;
										}
									}
								}
							}
						}
						else if (log[i].api === 'NtCreateUserProcess') {
							if (!parseInt(log[i].ret)) {
								process_json.createprocess[createprocess_cnt++] = {
									pid: log[i].pid,
									imgName: log[i].ImagePathName,
									cmdLine: log[i].cmdline
								};
							}
						}
						else if (log[i].api === 'NtWriteVirtualMemory') {
							if (!parseInt(log[i].ret)) {
								process_json.writememory[writememory_cnt++] = {
									pid: log[i].pid,
									baseAddress: log[i].BaseAddress,
									buf: log[i].Buffer
								};
							}
						}
						else if (check_list(log[i].api, connectfunc)) {
							socket_json[socket_cnt++] = { ip: log[i].ip, port: log[i].port, status: log[i].Status };
							socket_json[socket_cnt - 1].packet = {};
							packet_cnt = 0;
							for (let j = i + 1; j < log.length; j++) {
								if (check_list(log[j].api, socketfunc) && log[i].socket === log[j].socket) {
									socket_json[socket_cnt - 1].packet[packet_cnt++] = {
										api: log[j].api,
										buf: log[j].buf,
										len: log[j].len,
										time: log[j].time
									};
								}
								else if (check_list(log[j].api, socketclose) && log[i].socket === log[j].socket) {
									break;
								}
							}
						}
						else if (check_list(log[i].api, regcreate) || check_list(log[i].api, regopen)) {
							if (!parseInt(log[i].ret) && parseInt(log[i].KeyHandle)) {
								if (!(log[i].lpdwDisposition != undefined && parseInt(log[i].lpdwDisposition) == 2)) {
									if (check_list(log[i].api, regcreate)) {
										registry_json[registry_cnt++] = {
											mode: "ck",
											time: log[i].time,
											hive: get_hive(log[i].HIVE),
											key: log[i].lpSubKey
										};
									}
								}
								for (let j = i + 1; j < log.length; j++) {
									if (log[j].api === 'RegCloseKey' && log[i].KeyHandle == log[j].KeyHandle) {
										if (!parseInt(log[j].ret))
											break;
									}
									else if (check_list(log[j].api, regsetvalue) && log[i].KeyHandle == log[j].KeyHandle) {
										if (!parseInt(log[j].ret)) {
											let lpValueName = log[j].lpValueName == undefined ? log[j].lpSubKey : log[j].lpValueName;
											registry_json[registry_cnt++] = {
												mode: "sv",
												time: log[j].time,
												hive: get_hive(log[i].HIVE),
												key: log[i].lpSubKey,
												value: lpValueName,
												data: log[j].Data
											};
										}
									}
									else if (check_list(log[j].api, regsetkeyvalue) && log[i].KeyHandle == log[j].KeyHandle) {
										if (!parseInt(log[j].ret)) {
											registry_json[registry_cnt++] = {
												mode: "sv",
												time: log[j].time,
												hive: get_hive(log[i].HIVE),
												key: log[i].lpSubKey + "\\" + log[j].lpSubKey,
												value: lpValueName,
												data: log[j].Data
											};
										}
									}
									else if (check_list(log[j].api, regdeletekey) && log[i].KeyHandle == log[j].KeyHandle) {
										if (!parseInt(log[j].ret)) {
											registry_json[registry_cnt++] = {
												mode: "dk",
												time: log[j].time,
												hive: get_hive(log[i].HIVE),
												key: log[i].lpSubKey,
												deldst: log[j].lpSubKey
											};
										}
									}
									else if (check_list(log[j].api, regdeletevalue) && log[i].KeyHandle == log[j].KeyHandle) {
										if (!parseInt(log[j].ret)) {
											let subkey = log[j].lpSubKey == undefined ? log[i].lpSubKey : log[i].lpSubKey + "\\" + log[j].lpSubKey;
											registry_json[registry_cnt++] = {
												mode: "dv",
												time: log[j].time,
												hive: get_hive(log[i].HIVE),
												key: subkey,
												value: log[j].lpValueName
											};
										}
									}
								}
							}
						}
						else if (check_list(log[i].api, servicecreate)) {
							if (parseInt(log[i].ret)) {
								if (log[i].BinaryPathName != undefined) {//createservice
									service_json[service_cnt++] = {
										mode: "create",
										time: log[i].time,
										ret: log[i].ret,
										serviceName: log[i].ServiceName,
										BinaryPathName: log[i].BinaryPathName
									};
								}
								for (let j = i + 1; j < log.length; j++) {
									if (check_list(log[j].api, servicestart) && log[i].ret == log[j].Handle) {
										if (parseInt(log[j].ret)) {
											service_json[service_cnt++] = {
												mode: "start",
												time: log[j].time,
												serviceName: log[i].ServiceName
											};
										}
									}
									else if (log[j] == "DeleteService" && log[i].ret == log[j].Handle) {
										if (parseInt(log[j].ret)) {
											service_json[service_cnt++] = {
												mode: "delete",
												time: log[j].time,
												serviceName: log[i].ServiceName
											};
										}
									}
									else if (log[j] == "ControlService" && log[i].ret == log[j].Handle) {
										if (parseInt(log[j].ret)) {
											let Status, ControlCode = parseInt(log[j].ControlCode);
											if (ControlCode == 1) Status = "Stop";
											else if (ControlCode == 2) Status = "Pause";
											else if (ControlCode == 3) Status = "Restart";
											else continue;
											service_json[service_cnt++] = {
												mode: "control",
												time: log[j].time,
												serviceName: log[i].ServiceName,
												status: Status
											};
										}
									}
									else if (log[j].api === 'CloseServiceHandle' && log[i].ret == log[j].Handle) {
										if (parseInt(log[j].ret))
											break;
									}
								}
							}
						}
						else if (check_list(log[i].api, urldown)) {
							if (!parseInt(log[i].ret)) {
								urldownload.push([
									log[i].URL,
									log[i].FileName
								]);
							}
						}
					}

					logPath = './upload/' + timestamp + '/' + String(pid) + '/log';
					mkdirp(logPath).then(res => {
						console.log("mkdirp", res)
						fs.writeFileSync(logPath + '/file.json', JSON.stringify(file_json, null, 2));
						fs.writeFileSync(logPath + '/process.json', JSON.stringify(process_json, null, 2), 'binary');
						fs.writeFileSync(logPath + '/socket.json', JSON.stringify(socket_json, null, 2), 'binary');
						fs.writeFileSync(logPath + '/registry.json', JSON.stringify(registry_json, null, 2), 'binary');
						fs.writeFileSync(logPath + '/service.json', JSON.stringify(service_json, null, 2));

						console.log("finish to make friendly log");
						resolve(res)
					})
				})
			})
		});
	})
	Promise.all(promises).then(ret => {
		const virus_total = require('./virus_total');
		var hash = fs.readFileSync(`./upload/${timestamp}/FILEHASH`, 'utf8');
		virus_total(hash).then(function(ret){
			fs.writeFileSync(`./upload/${timestamp}/VIRUS`, JSON.stringify(ret, null, 2));
			return res.redirect(`/result/${timestamp}/7680`)
		})
	});
};