import sqlite3 from 'sqlite3';

const database_path = 'src/db/';
const db = new sqlite3.Database(database_path + 'association.db', (err) => {
  if (err) throw err;
});

export default db;
