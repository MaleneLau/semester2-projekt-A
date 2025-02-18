const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./users.db", (err) => 
    err ? console.error("DB-fejl:", err.message) : console.log("Forbundet til SQLite.")
);

module.exports = db;

