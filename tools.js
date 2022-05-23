const { redirect } = require("express/lib/response");
const fs = require("fs"); //importamos fs para escribir y leer archivos
const { request } = require("http");
const { stringify } = require("querystring");

const addNote = function (id,title, body) {
  //creacion de addNote para formar la estructura del archivo

 console.log("El id de la nota", id);
  console.log("El título de la nota", title);
  console.log("El cuerpo de la nota", body);
  const notes = loadNotes();
  const duplicateNote = notes.find((note) => note.id === id); //si la nota está duplicada se muestra una bandera
  if (!duplicateNote) {
    notes.push(
      //agregamos los valores que recibe yargs
      { id: id, title: title, body: body }
    );
    saveNotes(notes); //validación si existe o no una nota con el mismo titulo
    console.log("Notas creadas");
  } else {
    console.log("Nota duplicada");
    const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;

    id= maxId+1;
    console.log("ultimo id",id);
    id2= String(id);
    console.log(typeof id2);
    notes.push(
    
      //agregamos los valores que recibe yargs
      { id: id, title: title, body: body }
    );
    saveNotes(notes); //validación si existe o no una nota con el mismo titulo
  }
};
const saveNotes = function (notes) {
  // metodo para guardar las notas que agregamos,
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync("notes.json", dataJSON); //agrega la nota en el documento en formato Json
};
  const loadNotes = function () {
  try {
    const dataBuffer = fs.readFileSync("notes.json"); //obtiene el archivo de notas
    const dataJSON = dataBuffer.toString(); //lo muestra como cadena
    return JSON.parse(dataJSON); //devuelve la  lista
  } catch (e) {
    return []; //devuelve lista vacía
  }
};
  const listNotes = function () {
  const notes = loadNotes();

  notes.forEach((note) => {
    console.log(
      "titulo de la nota: ",
      note.title,
      "cuerpo de la nota: ",
      note.body
    );
  });
};
  const removeNote = function (title) {
  const notes = loadNotes();
  const notesToKeep = notes.filter((note) => note.title != title);

  if (notes.lenght > notesToKeep.lenght) {
    console.log("Note Remooved!!");
    saveNotes(notesToKeep);
  } else {
    console.log("Nota no Eliminada");
  }
};


const readOneNote = function (title) {
  const notes = loadNotes();
  const note = notes.find((note) => note.title === title);
    console.log(note.title, note.body);
    
};

const updateNote = function (id, updateTitle, updateBody) {
  const notes = loadNotes();
  console.log("el id llegando",id);
  let ids= Number(id)
  console.log("el id despues de maquillado",ids);
  let note = notes.findIndex((note) =>note.id === ids);
  console.log("holi",note);
  newnote =
  notes.splice(note, 1, {id:ids, title: updateTitle, body: updateBody});
  console.log("esto que es_ ",notes);
  saveNotes(notes);
  console.log("Nota modificada");

};

module.exports = {
  readOneNote: readOneNote,
  addNote: addNote,
  loadNotes: loadNotes,
  saveNotes: saveNotes,
  removeNote: removeNote,
  listNotes: listNotes,
  updateNote: updateNote,
};