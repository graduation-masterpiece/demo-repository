const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // MySQL 모듈을 불러옵니다.
const app = express();

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',     // MySQL 서버 호스트 (보통 localhost)
  user: 'root',          // MySQL 사용자명
  password: 'qkrwogur1',          // MySQL 비밀번호 (빈 문자열이면 비밀번호 없을 때)
  database: 'graduation_work'  // 사용할 데이터베이스 이름
});

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류:', err);
    return;
  }
  console.log('MySQL에 연결되었습니다.');
});

// CORS 설정: http://localhost:3000에서 오는 요청을 허용
app.use(cors({
  origin: 'http://localhost:3000',  // React 앱의 포트
  methods: ['GET', 'POST'],        // 필요한 HTTP 메소드
  allowedHeaders: ['Content-Type'] // 필요한 헤더
}));

// body-parser 설정 (혹시 필요하다면)
app.use(express.json());

// POST 요청 처리
app.post('/book', (req, res) => {
  const { isbn, title, author, publisher, pubdate, description } = req.body;

  // MySQL에 데이터 삽입
  const query = `INSERT INTO book_info (id, title, author, publisher, published_date, description) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [isbn, title, author, publisher, pubdate, description];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('MySQL 쿼리 실행 중 오류 발생:', err);
      return res.status(500).send('서버 오류');
    }
    console.log('책 정보가 데이터베이스에 저장되었습니다:', 'ISBN: ',isbn,' 제목: ',title);
    
    // isbn과 title 두 정보를 응답으로 반환
    res.status(200).send({
      message: '책 정보가 성공적으로 저장되었습니다.',
      isbn: isbn,
      title: title
    });
  });
});

// 서버 실행
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

