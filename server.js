const express = require("express");
const fs = require("fs");
const path = require("path");
const data = require('./db/db.json')

//Set up Localhost
var app = express();
var PORT = process.env.PORT || 3000;

//Made CSS render in Localhost the way it was intended
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
  });
// put /* at bottom
  
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"));
  });

  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  });

  //Post

  app.post("/api/notes", function(req, res) {

  let newNote = {'title': req.body.title, 'text': req.body.text} 
    data.push(newNote);
    updateNotes()
    res.json(newNote);
  });

const updateNotes = () => {
    data.forEach(addIdz(1))

    fs.writeFileSync('./db/db.json', JSON.stringify(data, null, 4))

    function addIdz(id) {
      return function inc(o) {
        if ('title' in o) {
               o.id = id++
        }
        Object.keys(o).forEach(function(k){
          Array.isArray(o[k]) && o[k].forEach(inc)
        })
    }
  }
}

// Delete

  app.delete('/api/notes/:id', (req, res) => {
    // Reading id from the URL
    let noteId = req.params.id;

    let note = data.filter(note => {
      return note.id == noteId;
    })[0];
  
    const index = data.indexOf(note);

    data.splice(index, 1);

    fs.writeFileSync('./db/db.json', JSON.stringify(data, null, 4))
    res.json(data)
  });

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });