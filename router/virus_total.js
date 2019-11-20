const vt = require("node-virustotal");

var func = function (hash) {
	return new Promise(function (resolve, reject) {
		var con = vt.MakePublicConnection();
		var list = {}, cnt = 0
		con.setKey("7d3cea32f282c1bf7b2f11cace420a78eb0128c4f9ef1726723412d792b85d66");
		con.setDelay(0);
		con.getFileReport(hash, function (data) {
			list.log = {}
			if (data.response_code == 1) {
				for (let [key, value] of Object.entries(data.scans)) {
					if (value.detected) {
						list.log[cnt++] = { key: key, result: value.result }
					}
				}
			}
			list.total = data.total;
			list.positives = data.positives;
			list.sha1 = data.sha1;
			list.sha256 = data.sha256;
			resolve(list);

		}, function (err) {
			console.error(err);
			resolve('none');
		}, true, function (waitingMessage) {
			console.log(waitingMessage);
			resolve('wait');
		});
	});
}
module.exports = async function (hash) {
	var ret = await func(hash);
	return ret;
}