import crypto from 'crypto';
import User from '../components/user.mjs';
import db from '../db/db.mjs';

export default function UserDao() {
  this.getUserById = (id) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE id=?';
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (row === undefined) {
          resolve({ error: 'User not found.' });
        } else {
          resolve(row);
        }
      });
    });
  };

  this.getUserByCredentials = (username, password) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username=?';
      db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
          return;
        } else if (row === undefined) {
          resolve(false);
        } else {
          const user = new User(row.id, row.username, row.role, row.name);
          crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
            if (err) reject(err);
            if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)) resolve(false);
            else resolve(user);
          });
        }
      });
    });
  };
}
