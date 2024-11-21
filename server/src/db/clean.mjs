import db from './db.mjs';

const cleanDB = async () => {
  try {
    await new Promise((resolve, reject) =>
      db.run(`DROP TABLE IF EXISTS preferences`, (err) => {
        if (err) {
          reject('Error deleting Preferences table:', err.message);
        } else {
          resolve();
        }
      })
    );
    await new Promise((resolve, reject) =>
      db.run(`DROP TABLE IF EXISTS proposals`, (err) => {
        if (err) {
          reject('Error deleting Proposals table:', err.message);
        } else {
          resolve();
        }
      })
    );
    await new Promise((resolve, reject) =>
      db.run(`DROP TABLE IF EXISTS processes`, (err) => {
        if (err) {
          reject('Error deleting Processes table:', err.message);
        } else {
          resolve();
        }
      })
    );
    await new Promise((resolve, reject) =>
      db.run(`DROP TABLE IF EXISTS users`, (err) => {
        if (err) {
          reject('Error deleting Users table:', err.message);
        } else {
          resolve();
        }
      })
    );
    console.log('Tables dropped');
  } catch (err) {
    console.log(err);
  }
};

cleanDB();
