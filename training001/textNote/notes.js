const fs = require("fs");
const fileName = "./notes-data.json";

let fetchNotes = () => {
	try {
		let notesString = fs.readFileSync(fileName);
		return (JSON.parse(notesString));	
	}
	catch(err) {
		return ([]);
	}

};
let saveNotes = (notes) => {
	fs.writeFileSync(fileName, JSON.stringify(notes));	
};

let addNote = (title, body) => {
	let notes = fetchNotes();
	let note = {
		title,
		body
	};
	let duplicatedNotes;

	duplicatedNotes = notes.filter(note => (note.title === title));
	if (duplicatedNotes.length === 0) {
		notes.push(note);
		saveNotes(notes);
		return (note);
	}
};

let removeNote = (title) => {
	let notes = fetchNotes();
	let filteredNotes = notes.filter(note => (note.title !== title));
	saveNotes(filteredNotes);
	return (notes.length !== filteredNotes.length);
}

let readNote = (title) => {
	let notes = fetchNotes();
	let filteredNotes = notes.filter(note => (note.title === title));
	return (filteredNotes[0]);
}

let logNotes = (note) => {
	console.log(`tilte: ${note.title}`);
	console.log(`body:  ${note.body}`);
}

let showAll = () => {
	return (fetchNotes());
}

module.exports = {
	addNote,
	removeNote,
	readNote,
	logNotes,
	showAll
};