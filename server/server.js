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

// Backend API
app.post("/clicked", (req, res) => {
  res.send("Hello, World!");
});

// Get all journals for user and return
app.get("/journals", (req, res) => {
  let journals = database.getAllJournals(1);
  journals.forEach(journal => {
    journal.journalType = journal.journalType == JOURNAL_TYPE.TODO? "T" : "N";
  });
  let html = journals.map((x) => template(__dirname + "templates/journalTab.hbs", x)).join("\n");
  res.send(html);
});

app.get("/journal", (req, res) => {
  // Check for the journalID query
  if (req.query.journalID == null) return res.sendStatus(500); 
  let journalID = Number(req.query.journalID);
  // Verify the journalID is provided and valid

  let journalData = database.getJournalData(journalID);
  let x = {
    user: "morgan2548510",
    journalName: journalData.journalName,
    content: journalData.content,
    prefix: journalData.journalType == JOURNAL_TYPE.TODO? "□" : ">",
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