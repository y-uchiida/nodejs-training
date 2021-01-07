const yargs = require("yargs");
const argv = yargs.argv;
const notes = require("./notes.js");
let command = argv._[0];

if (command === "add"){
	let note = notes.addNote(argv.title, argv.body);
	if (note) {
		console.log("saved new note!");
		console.log("-----------------");
		notes.logNotes(note);
	}
	else {
		console.error(`ERROR: note title "${argv.title}" is exist.`);
	}
}
else if (command === "remove"){
	let noteRemoved = notes.removeNote(argv.title);
	let message = (noteRemoved) ? `note "${argv.title} is removed."` : `note "${argv.title}" is not exit.` ;
	console.log(message);
}
else if (command === "read"){
	let note = notes.readNote(argv.title);
	if (note){
		notes.logNotes(note);
	}
	else {
		console.error(`ERROR: note title ${note.title} is not exist.`);
	}
}
else if (command === "list"){
	let allNotes = notes.showAll();
	console.log(`note has ${allNotes.length} items.`);
	allNotes.forEach(note => notes.logNotes(note));
}