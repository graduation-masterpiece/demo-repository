const express = require('express');
const cors = require('cors');
const db = require('./db'); // db.js에서 db 객체 가져오기
const { processBook } = require('./gpt'); // gpt.js에서 processBook 함수 가져오기
const app = express();

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// body-parser 설정
app.use(express.json());

// POST 요청 처리
app.post('/book', async (req, res) => {
  const { isbn, title, author, publisher, pubdate, description } = req.body; // 요청 본문에서 데이터 가져옴

  try {
    // 1. book_info 테이블에 데이터 삽입 
    const insertBookInfoQuery = `INSERT INTO book_info (id, title, author, publisher, published_date, description) 
                                  VALUES (?, ?, ?, ?, ?, ?)`;
    const bookInfoValues = [isbn, title, author, publisher, pubdate, description];

    db.query(insertBookInfoQuery, bookInfoValues, async (err, result) => {
      if (err) {
        console.error('MySQL 쿼리 실행 중 오류 발생:', err);
        return res.status(500).send('서버 오류');
      }
      console.log('책 정보가 book_info 테이블에 저장되었습니다:', result);

      // 2. 이미지 생성 및 요약본 생성 (book_info에 데이터 삽입 후 진행)
      try {
        const imageResult = await processBook(isbn); // 방금 삽입한 책의 ID를 사용
        const imagePath = imageResult.imagePath; // 생성된 이미지 URL
        const summary = imageResult.splitSummary; // 생성된 요약본

        // 3. book_card 테이블에 이��지와 요약본 저장
        const insertBookCardQuery = `INSERT INTO book_card (image_url, summary, book_info_id, likes) 
                                      VALUES (?, ?, ?, ?)`;
        const bookCardValues = [imagePath, summary, isbn, 0]; // book_info의 ID와 기본 likes 값 0

        db.query(insertBookCardQuery, bookCardValues, (err) => {
          if (err) {
            console.error('MySQL 쿼리 실행 중 오류 발생:', err);
            return res.status(500).send('서버 오류');
          }
          console.log('이미지와 요약본이 book_card 테이블에 저장되었습니다.');
          res.status(200).send({
            message: '책 정보와 이미지, 요약본이 성공적으로 저장되었습니다.',
            imageUrl: imagePath,
            summary: summary
          });
        });
      } catch (imageError) {
        console.error('이미지 생성 중 오류 발생:', imageError);
        res.status(500).send('이미지 생성 중 오류 발생');
      }
    });
  } catch (error) {
    console.error('Book processing error:', error);
    res.status(500).send('책 처리 중 오류 발생');
  }
});

// 서버 실행
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

