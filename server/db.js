require('dotenv').config(); // dotenv 패키지 로드

const mysql = require('mysql2');

// MySQL 연결 설정
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: '+09:00',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db; // db 객체를 내보냄
