import jwt from 'jsonwebtoken';

export const createToken = (data) =>
  jwt.sign(data, process.env.TOKEN_SECRET, {
    expiresIn: 10800,
  });
