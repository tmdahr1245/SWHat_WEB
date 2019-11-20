const mime = require('mime');
const fs = require('fs');

module.exports = function (req, res) {
    var filename = req.params.filename;
    var timestamp = req.params.timestamp;
    var pid = req.params.pid;
    var origFileNm, savedPath;

    origFileNm = filename;
    savedPath = './upload/' + timestamp + '/' + pid + '/file';
    var file = savedPath + '/' + origFileNm;

    mimetype = mime.lookup(origFileNm);

    res.setHeader('Content-disposition', 'attachment; filename=' + origFileNm);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
};