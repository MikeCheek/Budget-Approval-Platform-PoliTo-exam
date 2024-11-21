import { crypt_password } from '../utilities/password.mjs';
import db from './db.mjs';
import { USER_ROLE } from '../utilities/constants.mjs';

const users = [
  {
    username: 'admin@email.com',
    role: USER_ROLE.ADMIN,
    password: 'socialbudget24',
    name: 'Administrator',
  },
  {
    username: 'carmelo@email.com',
    role: USER_ROLE.MEMBER,
    password: 'socialbudget24',
    name: 'Carmelo Patti',
  },
  {
    username: 'rosario@email.com',
    role: USER_ROLE.MEMBER,
    password: 'socialbudget24',
    name: 'Rosario Bella',
  },
  {
    username: 'francesco@email.com',
    role: USER_ROLE.MEMBER,
    password: 'socialbudget24',
    name: 'Francesco Privitera',
  },
];

const createDB = async () => {
  try {
    await new Promise((resolve, reject) =>
      db.run(
        `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, role TEXT NOT NULL,
    name TEXT NOT NULL, salt TEXT NOT NULL, createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)`,
        (err) => {
          if (err) {
            reject('Error creating Users table:', err.message);
          } else {
            resolve();
          }
        }
      )
    );

    await new Promise((resolve, reject) =>
      db.run(
        `CREATE TRIGGER IF NOT EXISTS updateTimestamp AFTER UPDATE ON users FOR EACH ROW BEGIN UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id; END;`,
        (err) => {
          if (err) {
            reject('Error creating updateTimestamp trigger:', err.message);
          } else {
            resolve();
          }
        }
      )
    );

    await new Promise((resolve, reject) =>
      db.run(
        `CREATE TABLE IF NOT EXISTS processes (id INTEGER PRIMARY KEY AUTOINCREMENT, phase INTEGER NOT NULL, budget DOUBLE(20,2),
         createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP)`,
        (err) => {
          if (err) {
            reject('Error creating Processes table:', err.message);
          } else {
            resolve();
          }
        }
      )
    );

    await new Promise((resolve, reject) =>
      db.run(
        `CREATE TRIGGER IF NOT EXISTS updateTimestamp AFTER UPDATE ON processes FOR EACH ROW BEGIN UPDATE processes SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id; END;`,
        (err) => {
          if (err) {
            reject('Error creating updateTimestamp trigger:', err.message);
          } else {
            resolve();
          }
        }
      )
    );

    await new Promise((resolve, reject) =>
      db.run(
        `CREATE TABLE IF NOT EXISTS proposals (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, processId INTEGER NOT NULL, description TEXT NOT NULL,
    cost DOUBLE(10,2) NOT NULL, preferences INTEGER, approved BOOLEAN, createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (processId) REFERENCES processes(id) ON DELETE CASCADE ON UPDATE CASCADE )`,
        (err) => {
          if (err) {
            console.log(err);
            reject('Error creating Proposals table:', err.message);
          } else {
            resolve();
          }
        }
      )
    );

    await new Promise((resolve, reject) =>
      db.run(
        `CREATE TRIGGER IF NOT EXISTS updateTimestamp AFTER UPDATE ON proposals FOR EACH ROW BEGIN UPDATE proposals SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id; END;`,
        (err) => {
          if (err) {
            reject('Error creating updateTimestamp trigger:', err.message);
          } else {
            resolve();
          }
        }
      )
    );

    await new Promise((resolve, reject) =>
      db.run(
        `CREATE TABLE IF NOT EXISTS preferences (userId INTEGER NOT NULL, proposalId INTEGER NOT NULL, score INTEGER NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, proposalId),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (proposalId) REFERENCES proposals(id) ON DELETE CASCADE ON UPDATE CASCADE )`,
        (err) => {
          if (err) {
            reject('Error creating Preferences table:', err.message);
          } else {
            resolve();
          }
        }
      )
    );

    await new Promise((resolve, reject) =>
      db.run(
        `CREATE TRIGGER IF NOT EXISTS updateTimestamp AFTER UPDATE ON preferences FOR EACH ROW BEGIN UPDATE preferences SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id; END;`,
        (err) => {
          if (err) {
            reject('Error creating updateTimestamp trigger:', err.message);
          } else {
            resolve();
          }
        }
      )
    );

    users.forEach(async (user) => {
      const { hashed, salt } = await crypt_password(user.password);
      await new Promise((resolve, reject) =>
        db.run(
          `INSERT INTO users(username,password,salt,role,name) VALUES(?,?,?,?,?)`,
          [user.username, hashed, salt, user.role, user.name],
          (err) => {
            if (err) {
              reject('Error inserting user:', err.message);
            } else {
              resolve();
            }
          }
        )
      );
    });

    // await new Promise((resolve, reject) =>
    //   db.run('INSERT INTO processes(phase) VALUES(0)', (err) => {
    //     if (err) {
    //       reject('Error creating process:', err.message);
    //     } else {
    //       resolve();
    //     }
    //   })
    // );

    console.log('Tables created');
  } catch (err) {
    console.error(err);
  }
};

createDB();
