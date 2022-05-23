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
app.get("/delete/:title", (request, response) => {
  const titledelete = request.params.title;
  const notes = tools.loadNotes();
  const notesToKeep = notes.filter((note) => note.title != titledelete);
    tools.saveNotes(notesToKeep);
  response.redirect("/list_notes",titledelete, "BORRADO");
  /*
  let notes = tools.loadNotes();
  notes = notes.filter((note) => note.title !== titledelete);
 
  response.status(204).end();*/
  response.send("recivido homs");
});

app.get("/agregar", (request, response) => {
  response.render("agregar");
});

app.post("/agregarNota", (request, response) => {
  console.log("funcion para crear nota post");
  tools.addNote(request.body.title, request.body.bodyr);
  response.redirect("/list_notes");
});

app.get("/actualizar/:title", (request, response) => {
  let titulo = request.params.title;
  const notes = tools.loadNotes();
  const note = notes.find((note) => note.title === titulo);

  response.render("actualizar", { note });
});

app.post("/update", (request, response) => {
  let titulo = request.body.updateTitle;
  let cuerpo = request.body.updateBody;
  tools.updateNote(titulo, titulo, cuerpo);
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
