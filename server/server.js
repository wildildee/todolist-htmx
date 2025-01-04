import express from "express";
import {Database} from "./database.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import Handlebars from "handlebars";

const __dirname = dirname(fileURLToPath(import.meta.url)) + "/../";

// Templates
function template(filename, data)
{
  var source   = readFileSync(filename,'utf8').toString();
  return Handlebars.compile(source);
}

const journalTab = template(__dirname + "templates/journalTab.hbs");

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
  let html = journals.map((x) => journalTab(x)).join("\n");
  res.send(html);
});

app.get("/pages", (req, res) => {
  let journals = database.getAllJournals(1);
  let html = journals.map((x) => journalTab(x)).join("\n");
  res.send(html);
});

// Listen
app.listen(3000, () => {
  console.log("Server listening on port 3000")
});