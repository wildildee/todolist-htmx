import sqlite3 from "sqlite3";

export class Database {
  constructor(filepath) {
    // Create database
    this.database = new sqlite3.Database(filepath, (err) => {
      if(err != null) {
        console.error(err);
        exit(1);
      }
    });

    // Create tables if not already created
    this.database.run(`
    CREATE TABLE IF NOT EXISTS users(
      key INTEGER PRIMARY KEY AUTOINCREMENT,
      username CHAR(64) UNIQUE,
      passHash BINARY(256)
      )`);
    this.database.run(`
      CREATE TABLE IF NOT EXISTS journals(
        key INTEGER PRIMARY KEY AUTOINCREMENT,
        userKey INTEGER,
        journalName CHAR(256),
        FOREIGN KEY(userKey) REFERENCES users(key)
        )`);
    this.database.run(`
      CREATE TABLE IF NOT EXISTS pages(
        key INTEGER PRIMARY KEY AUTOINCREMENT,
        journalKey INTEGER,
        pageName CHAR(256),
        FOREIGN KEY(journalKey) REFERENCES journal(key)
        )`);
    this.database.run(`
      CREATE TABLE IF NOT EXISTS entries(
        key INTEGER PRIMARY KEY AUTOINCREMENT,
        pageKey INTEGER,
        content CHAR(256),
        FOREIGN KEY(pageKey) REFERENCES page(key)
        )`);
  }

  // Return a list of all journals for the userID
  getAllJournals(userID) {
    return [{"journalID": 1, "journalName": "Blank Journal", "journalType": 1}, {"journalID": 1, "journalName": "Blank Journal", "journalType": 0}, {"journalID": 1, "journalName": "Blank Journal", "journalType": 0}, {"journalID": 1, "journalName": "Blank Journal", "journalType": 0}]
  }

  // Return the journal data for the journalID
  getJournalData(journalID) {
    return [{"pageID": 1, "pageName": "wdawd", "content": ["awdawdaw", "awdawgrtdhtyjk", "jhytrjtgyjaq"]}]
  }
}
