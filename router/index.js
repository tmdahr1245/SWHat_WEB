const fs = require('fs');
const glob = require('glob-promise');
const path = require('path');
const moment = require('moment');

module.exports = function (req, res) {
	console.log(req.ip);
	console.log(req.url);
	console.log(req.params);
	var anal_list = [];
	fs.readdir('./upload', async function (error, timestamp) {
		for (var i = 0; i < timestamp.length; i++) {
			if (!isNaN(parseInt(timestamp[i]))) {
				var obj = JSON.parse(fs.readFileSync(`./upload/${timestamp[i]}/info.json`, 'utf8'));
				var hash = fs.readFileSync(`./upload/${timestamp[i]}/FILEHASH`, 'utf8');
				var virus = JSON.parse(fs.readFileSync(`./upload/${timestamp[i]}/VIRUS`, 'utf8'));
				var name;
				await glob(`./upload/${timestamp[i]}/*.exe`)
					.then(function (contents) {
						name = path.basename(contents[0].replace(/\\/gi, '/'));
					});
				anal_list.push([
					name,
					hash,
					`/result/${timestamp[i]}/${obj.root}`,
					moment(parseInt(timestamp[i])).format("YYYY-MM-DD HH:mm:ss"),
					virus
				]);
			}
		}
		res.render('upload', {
			title: "다돌려",
			fs: fs,
			anal_list: anal_list
		})
	})
};