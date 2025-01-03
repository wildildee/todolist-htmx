import express from "express";
import sqlite3 from "sqlite3";

const dir = `${import.meta.dirname}/public/`

// Create app
const app = express();
app.use(express.urlencoded({extended: false}));

// Create database
var database = new sqlite3.Database('./db.db', (err) => {
  if(err != null) {
    console.error(err);
    exit(1);
  }
});

// Create tables if not already created
database.run(`
  CREATE TABLE IF NOT EXISTS users(
    key INTEGER PRIMARY KEY
    )`);

// Static
app.use(express.static('public'));

// Routes
app.get("/", (req, res) => {
  res.sendFile(dir + "../public/index.html");
});

app.post("/clicked", (req, res) => {
  res.send("Hello, World!");
});

// Listen
app.listen(3000, () => {
  console.log("Server listening on port 3000")
});