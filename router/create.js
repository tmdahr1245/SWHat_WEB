const mkdirp = require('mkdirp-promise');
const fs = require('fs');
const fs_extra = require('fs-extra');
const crypto = require('crypto');
const exec = require('child_process').exec;

module.exports = function (req, res) {
	try {
		const files = req.files;
		let originalName = '';
		let fileName = '';
		let mimeType = '';
		let size = 0;

		let timestamp = String(new Date().getTime());
		mkdirp("upload/" + timestamp);

		if (Array.isArray(files)) {
			originalName = files[0].originalname;
			fileName = files[0].filename;
			mimeType = files[0].mimetype;
			size = files[0].size;
		}
		else {
			originalName = files[0].originalname;
			fileName = files[0].filename;
			mimeType = files[0].mimetype;
			size = files[0].size;
		}
		console.log(fileName);
		let src = './upload/' + fileName;
		let dst = './upload/' + timestamp + '/' + fileName;

		fs_extra.move(src, dst, function (err) {
			if (err) {
				return console.error(err)
			}
			fs.readFile("upload/" + timestamp + "/" + fileName, 'binary', function (err, data) {
				if (!(data[0] == 'M' && data[1] == 'Z')) {
					fs.unlinkSync("./upload/" + timestamp + "/" + fileName);
					res.write("<script language=\"javascript\">alert('Not PE')</script>");
					res.write(`<script language=\"javascript\">window.location=\"/\"</script>`);
				}
				//image_file_header->machine = 014c [32bit]
				//image_file_header->machine = 8664 [64bit]
				else {
					var image_file_header = "0x";
					for (var i = 0x3f; i > 0x3b; i--)
						image_file_header += ("00" + data.charCodeAt(i).toString(16)).substr(-2);
					image_file_header = parseInt(image_file_header);
					var machine = image_file_header + 4;
					var result = "0x";
					for (var i = machine + 1; i > machine - 1; i--)
						result += ("00" + data.charCodeAt(i).toString(16)).substr(-2);
					if (result == '0x8664') {//64bit
						fs.unlinkSync("./upload/" + timestamp + "/" + fileName);
						res.write("<script language=\"javascript\">alert('Not 64bit PE, Please Only 32bit PE')</script>");
						res.write(`<script language=\"javascript\">window.location=\"/\"</script>`);
					}
					else if (result == '0x014c') {//32bit
						console.log('file inform : ', originalName, fileName, mimeType, size);

						var hash = crypto.createHash('md5');

						var name = `./upload/${timestamp}/${fileName}`;
						var input = fs.createReadStream(name);

						input.on('readable', function () {
							var data = input.read();
							if (data)
								hash.update(data);
							else {
								fs.writeFileSync(`./upload/${timestamp}/FILEHASH`, hash.digest('hex'));
							}
						});

						exec("sudo kvm-spice -enable-kvm -hda /var/lib/libvirt/images/win10.qcow2 -spice port=5900,disable-ticketing -m 8192 -net nic -net user -usb -device usb-tablet");
						setTimeout(() => {
							res.redirect(`/spice?timestamp=${timestamp}&filename=${fileName}`);
						}, 30000);
					}

				}
			});
		});
	}
	catch (err) {
		console.dir(err.stack);
	}
};