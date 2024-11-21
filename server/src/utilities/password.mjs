import crypto from 'crypto';

const crypt_password = async (password) => {
  const salt = crypto.randomBytes(32).toString('hex');
  return new Promise((resolve, reject) =>
    crypto.scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) reject(err);

      resolve({ hashed: derivedKey.toString('hex'), salt });
    })
  );
};

export { crypt_password };
