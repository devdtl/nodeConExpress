const express = require("express");
const app = express();
app.use(express.json());
const tools = require("./tools.js");
const hbs = require("hbs");

hbs.registerPartials(__dirname + "/views/partials", function (err) {});
app.set("view engine", "hbs");
app.set("views", __dirname + "/views/");
app.use(express.static(__dirname + "/public"));
const bodyParser = require("body-parser");
const { redirect } = require("express/lib/response");
app.use(express.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

let notes = [
  {
    id: 1,
    content: "HTML es sencillo",
    date: "2022-04-25T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "El navegador puede ejecutar sólo JavaScript",
    date: "2022-04-25T17:40:31.098Z",
    important: false,
  },
  {
    id: 3,
    content: "GET y POST son los métodos más importantes de HTTP",
    date: "2022-04-25T17:50:31.098Z",
    important: true,
  },
];

app.get("/", (request, response) => {
  let nombres = {
    nombre: "kike",
    apellido: "del toro",
  };
  response.render("index", { nombres });
});

app.get("/list_notes", (request, response) => {
  let notes1 = tools.loadNotes();
  console.log(notes1);
  response.render("lista", { notes1 });
});
app.get("/delete/:id", (request, response) => {
  const id = request.params.id;
  const notes = tools.loadNotes();
  const notesToKeep = notes.filter((note) => note.id != id);
  tools.saveNotes(notesToKeep);
  response.redirect("/list_notes");
  /*
  let notes = tools.loadNotes();
  notes = notes.filter((note) => note.title !== titledelete);
 
  response.status(204).end();*/
  response.send("recibido homs");
});

app.get("/agregar", (request, response) => {
  response.render("agregar");
});

app.post("/agregarNota", (request, response) => {
  console.log("funcion para crear nota post");
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  const note = request.body;
  note.id = maxId + 1;
  console.log("este es ", note.id);
  tools.addNote(note.id, request.body.title, request.body.bodyr);
  response.redirect("/list_notes");
});

app.get("/actualizar/:id", (request, response) => {
  let id = Number(request.params.id);

  console.log(id);
  const notes = tools.loadNotes();

  const note = notes.find((note) => note.id === id);
  response.render("actualizar", { note });
});

app.post("/update", (request, response) => {
  let id = String(request.body.id);
  let titulo = request.body.updateTitle;
  let cuerpo = request.body.updateBody;
  console.log("este es ", id);
  console.log("este es ", titulo);
  console.log("este es ", cuerpo);

  tools.updateNote(id, titulo, cuerpo);
  response.redirect("/list_notes");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

app.post("/api/notes/add", (request, response) => {
  /* const note = request.body
    console.log(note)
    response.json(note)*/
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  const note = request.body;
  note.id = maxId + 1;
  notes = notes.concat(note);
  response.json(note);
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
