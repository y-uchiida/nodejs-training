const fs = require("fs");
const os = require("os");
const user = os.userInfo();
const file = "./testfile.txt";
const myModule = require("./myModule.js");

fs.appendFile(file, "====================\n\n", (err) => {
	if (err)
		console.error(err);
});

fs.appendFile(file, "my append string.\n", (err) => {
	if (err)
		console.error(err);
});

fs.appendFile(file,
	"user info...\n" +
	`username: ${user.username}\n` +
	`homedir: ${user.homedir}\n`
	, (err) => {
	if (err)
		console.error(err);
});

let x = 10;
let y = 20;
console.log(`mymodule.myModule_sum(${x}, ${y}) result is...`, myModule.myModule_sum(x, y));