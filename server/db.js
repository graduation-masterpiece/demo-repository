require('dotenv').config(); // dotenv 패키지 로드

// db.js
const mysql = require('mysql2');

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'database-1.cr6sc2og4hhr.ap-northeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'Rdsadminpwd',
  database: 'graduation_work'
});

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류:', err);
    return;
  }
  console.log('MySQL에 연결되었습니다.');
});

module.exports = db; // db 객체를 내보냄
