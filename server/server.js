const express = require('express');
const cors = require('cors');
const db = require('./db');
const { processBook } = require('./gpt');
const path = require('path');
const axios = require('axios');
require('dotenv').config(); // .env 파일 로드

const app = express();

// CORS 설정
app.use(cors({
  origin: ['http://localhost:3000', 'http://15.164.227.43'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// body-parser 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS 설정
app.set("view engine", "ejs");

// 네이버 API 프록시 엔드포인트
app.get('/api/naver-search', async (req, res) => {

  let query = req.query.query;
  const display = req.query.display || 10;
  const start = req.query.start || 1;


  try {
    const response = await axios.get('https://openapi.naver.com/v1/search/book.json', {
      params: { query, display, start },
      headers: {
        'X-Naver-Client-Id': 'au4DM1C3cSYpQy5J5AiF',
        'X-Naver-Client-Secret': 'UDJTo2mDUy',
	'User-Agent': 'Mozilla/5.0'

      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('네이버 API 요청 실패:', error);
    res.status(500).json({ error: '네이버 API 요청 실패', details: error.response ? error.response.data : error.message });
  }
});

// 책 정보 저장 API
app.post('/api/book', async (req, res) => {

  console.log('요청 본문: ', req.body);
  const { isbn, title, author, publisher, pubdate, description, book_cover } = req.body;

  const cleanTitle = title.replace(/\s*\(.*?\)/, '');

  try {
    const insertBookInfoQuery = `
      INSERT INTO book_info (id, title, author, publisher, published_date, description, book_cover) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const bookInfoValues = [isbn, cleanTitle, author, publisher, pubdate, description, book_cover];

    db.query(insertBookInfoQuery, bookInfoValues, async (err, result) => {
      if (err) {
        console.error('MySQL 쿼리 실행 중 오류 발생:', err);
        return res.status(500).send('서버 오류');
      }

      try {
        const imageResult = await processBook(isbn);
        const imagePath = imageResult.imagePath;
        const summary = imageResult.summary;

        const insertBookCardQuery = `
          INSERT INTO book_card (image_url, summary, book_info_id, likes) 
          VALUES (?, ?, ?, ?)`;
        const bookCardValues = [imagePath, summary, isbn, 0];

        db.query(insertBookCardQuery, bookCardValues, (err) => {
          if (err) {
            console.error('MySQL 쿼리 실행 중 오류 발생:', err);
            return res.status(500).send('서버 오류');
          }
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

// 전체 책 정보 가져오기
app.get('/api/book-cards', (req, res) => {
  const query = `
    SELECT bi.id, bi.title, bi.author, bi.book_cover, bc.image_url, bc.summary, bc.likes
    FROM book_info bi
    LEFT JOIN book_card bc ON bi.id = bc.book_info_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('MySQL 쿼리 실행 중 오류 발생:', err);
      return res.status(500).send('서버 오류');
    }

    if (results.length === 0) {
      return res.status(404).send('책을 찾을 수 없습니다.');
    }

    try {
      const formattedData = results.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        image_url: book.image_url,
        book_cover: book.book_cover,
        summary: book.summary ? JSON.parse(book.summary) : null,
        likes: book.likes
      }));

      res.status(200).json(formattedData);
    } catch (error) {
      console.error('데이터 변환 중 오류 발생:', error);
      res.status(500).send('데이터 변환 중 오류가 발생했습니다.');
    }
  });
});

// 특정 책 정보 가져오기
app.get('/api/book/:id', (req, res) => {
  const bookId = req.params.id;
  const query = `
    SELECT bi.id, bi.title, bi.author, bi.book_cover, bc.image_url, bc.summary, bc.likes
    FROM book_info bi
    LEFT JOIN book_card bc ON bi.id = bc.book_info_id
    WHERE bi.id = ?
  `;

  db.query(query, [bookId], (err, results) => {
    if (err) {
      console.error('MySQL 쿼리 실행 중 오류 발생:', err);
      return res.status(500).send('서버 오류');
    }

    if (results.length === 0) {
      return res.status(404).send('책을 찾을 수 없습니다.');
    }

    const book = results[0];
    try {
      res.status(200).json({
        id: book.id,
        title: book.title,
        author: book.author,
        book_cover: book.book_cover,
        image_url: book.image_url,
        summary: book.summary === 'string' ? JSON.parse(book.summary) : book.summary,
        likes: book.likes
      });
    } catch (error) {
      console.error('데이터 변환 중 오류 발생:', error);
      res.status(500).send('데이터 변환 중 오류가 발생했습니다.');
    }
  });
});

// 라이브러리 페이지
app.get('/api/my-library', (req, res) => {
  const query = `
    SELECT bi.id, bi.title, bc.image_url, bc.likes
    FROM book_info bi
    LEFT JOIN book_card bc ON bi.id = bc.book_info_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('MySQL 쿼리 실행 중 오류 발생:', err);
      return res.status(500).send('서버 오류');
    }
    res.status(200).json(results);
  });
});

app.get('/book/:bookId', async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const response = await axios.get('http://15.164.227.43/book/${bookId}');
    const book = response.data;

    res.render('book', {
      title: book.title,
      description: book.description,
      imageUrl: book.image_url,
      url: `http://15.164.227.43/book/${bookId}`,
    });
  } catch (error) {
    res.status(500).send('서버 오류');
  }
});

// 서버 실행
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
