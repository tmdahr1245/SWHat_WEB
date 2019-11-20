const JSONStream = require("JSONStream");
const fs = require('fs');

let tree = [];
let cnt = 0;
let log_cnt = 13 - 1;
let main_pid = '7680';

var func = function (pid) {
	let stream = fs.createReadStream(`wanna/${pid}.json`, { encoding: 'binary' }),
		parser = JSONStream.parse();

	stream.pipe(parser);
		parser.on('data', function (obj) {
			log = obj['log'];

			for (let i = 0; i < log.length; i++) {
				if (log[i].api === 'NtCreateUserProcess') {
					if (!parseInt(log[i].ret)) {
						cnt ++;
						console.log(log[i].pid)
						console.log(cnt)
						tree.push([pid, log[i].pid]);
						func(log[i].pid);
					}
				}
			}
			if(cnt === log_cnt){
				console.log(tree);
			}
		});
};
func(main_pid);
