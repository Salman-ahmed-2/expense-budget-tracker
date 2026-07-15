const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../database/expense_tracker.db');
const schemaPath = path.resolve(__dirname, '../../database/schema.sql');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');

    // Check if tables exist, if not, run schema
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='transactions'", (err, row) => {
      if (err) {
        console.error('Error checking for tables:', err.message);
        return;
      }
      if (!row) {
        console.log('Tables do not exist. Initializing database with schema.sql...');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema, (err) => {
          if (err) {
            console.error('Error executing schema:', err.message);
          } else {
            console.log('Database schema initialized.');
          }
        });
      } else {
        console.log('Database tables already exist.');
      }
    });
  }
});

module.exports = db;
