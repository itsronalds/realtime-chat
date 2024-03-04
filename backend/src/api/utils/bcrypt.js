import bcrypt from 'bcrypt';

export const encryptPassword = (password) => bcrypt.hash(password, 10);

export const decryptPassword = (password, hash) =>
  bcrypt.compare(password, hash);
