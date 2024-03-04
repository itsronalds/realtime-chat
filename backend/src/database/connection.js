import mysql from 'mysql';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'chat_application',
  port: 3306,
  charset: 'utf8mb4',
});

db.getConnection((err, connection) => {
  if (err) {
    console.log('Db connection error');
  }

  if (connection) {
    connection.release();
  }
});

const dbQuery = promisify(db.query).bind(db);

export default dbQuery;
