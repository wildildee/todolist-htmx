import express from "express";
import {Database} from "./database.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import Handlebars from "handlebars";

const __dirname = dirname(fileURLToPath(import.meta.url)) + "/../";

const JOURNAL_TYPE = {
  TODO: 0,
  NOTES: 1
};

// Templates
function template(filename, data)
{
  var source   = readFileSync(filename,'utf8').toString();
  return Handlebars.compile(source)(data);
}


// Create app
const app = express();
app.use(express.urlencoded({extended: false}));

// Initialize database
var database = new Database(__dirname + 'db/database.db');

// Static
app.use(express.static('routes'));
app.use(express.static('public'));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "routes/index.html");
});

//
// Backend API
//

// Create a new session using the provided username and passhash
app.post("/sessions/create", (req, res) => {
  let username = req.query.username;
  let passhash = req.query.passhash;
  
  if (username == undefined || passhash == undefined || username.indexOf("'") != -1) {
    res.sendStatus(500)
    return
  } 

  // Get the passhash from db and confirm it matches
  

});

// Get all journals for user and return
app.get("/journals", (req, res) => {
  let journals = database.getAllJournals(1);
  let x = {journals: []};
  journals.forEach(journal => {
    x.journals.push({
      journalName: journal.journalName,
      journalID: journal.journalID,
      journalType: journal.journalType == JOURNAL_TYPE.TODO? "T" : "N",
      typeClass: journal.journalType == JOURNAL_TYPE.TODO? "todo" : "note"
    });
  });

  let html = template(__dirname + "templates/journalTab.hbs", x);
  res.send(html);
});

// Create a new blank journal
app.post("/journals/create", (req, res) => {
  
});

// Get specific journal for user and return
app.get("/journals/get", (req, res) => {
  // Check for the journalID query
  if (req.query.journalID == null) {
    let html = template(__dirname + "templates/noOpenJournal.hbs");
    res.send(html);
    return
  }

  // Verify the journalID is provided and valid
  let journalID = Number(req.query.journalID);
  if (journalID == NaN) {
    res.sendStatus(500); 
    return
  }

  let journalData = database.getJournalData(journalID);
  let x = {
    user: "morgan2548510",
    journalName: journalData.journalName,
    content: journalData.content,
    prefix: journalData.journalType == JOURNAL_TYPE.TODO? "□" : ">",
    typeClass: journalData.journalType == JOURNAL_TYPE.TODO? "todo" : "note",
    journalID: journalData.journalID,
    fileType: journalData.journalType == JOURNAL_TYPE.TODO? "todo" : "note"
  }
  let html = template(__dirname + "templates/openJournal.hbs", x);
  res.send(html);
});

// Listen
app.listen(3000, () => {
  console.log("Server listening on port 3000")
});