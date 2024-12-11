const express = require('express');
const cors = require('cors');
const db = require('./db');
const { processBook } = require('./gpt');
const path = require('path');
const app = express();

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// body-parser 설정
app.use(express.json());

// 정적 파일 제공 설정
app.use('/generated_images', express.static(path.join(__dirname, 'generated_images')));

// POST 요청 처리
app.post('/book', async (req, res) => {
  const { isbn, title, author, publisher, pubdate, description, book_cover } = req.body;

  try {
    // 1. book_info 테이블에 데이터 삽입 
    const insertBookInfoQuery = `INSERT INTO book_info (id, title, author, publisher, published_date, description, book_cover) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const bookInfoValues = [isbn, title, author, publisher, pubdate, description, book_cover];

    db.query(insertBookInfoQuery, bookInfoValues, async (err, result) => {
      if (err) {
        console.error('MySQL 쿼리 실행 중 오류 발생:', err);
        return res.status(500).send('서버 오류');
      }
      console.log('책 정보가 book_info 테이블에 저장되었습니다:', result);

      // 2. 이미지 생성 및 요약본 생성
      try {
        const imageResult = await processBook(isbn);
        const imagePath = imageResult.imagePath;
        const summary = imageResult.summary;
        const keyword = imageResult.keyword;

        // 3. book_card 테이블에 이미지와 요약본 저장
        const insertBookCardQuery = `INSERT INTO book_card (image_url, summary, book_info_id, likes) 
                                    VALUES (?, ?, ?, ?)`;
        const bookCardValues = [imagePath, summary, isbn, 0];

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

// 전체 책 정보 가져오기
app.get('/book-cards', (req, res) => {
  const query = `
    SELECT 
      bi.id,
      bi.title,
      bi.author,
      bi.book_cover,
      bc.image_url,
      bc.summary,
      bc.likes
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
      // 모든 책의 데이터를 처리
      const formattedData = results.map(book => {
        // summary가 문자열로 저장되어 있다면 파싱
        let parsedSummary;
        if (typeof book.summary === 'string') {
          parsedSummary = JSON.parse(book.summary);
        } else {
          parsedSummary = book.summary;
        }

        return {
          id: book.id,
          title: book.title,
          author: book.author,
          image_url: book.image_url,
          book_cover: book.book_cover,
          summary: parsedSummary,
          likes: book.likes
        };
      });
      
      res.status(200).json(formattedData);
    } catch (error) {
      console.error('데이터 변환 중 오류 발생:', error);
      res.status(500).send('데이터 변환 중 오류가 발생했습니다.');
    }
  });
});

// 특정 책 정보 가져오기
app.get('/book/:id', (req, res) => {
  const bookId = req.params.id;
  const query = `
    SELECT 
      bi.id,
      bi.title,
      bi.author,
      bi.book_cover,
      bc.image_url,
      bc.summary,
      bc.likes
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
      // summary가 문자열로 저장되어 있다면 파싱
      let parsedSummary;
      if (typeof book.summary === 'string') {
        parsedSummary = JSON.parse(book.summary);
      } else {
        parsedSummary = book.summary;
      }

      // 데이터 형식을 book-cards 엔드포인트와 동일하게 맞춤
      const formattedData = [{  
        id: book.id,
        title: book.title,
        author: book.author,
        book_cover: book.book_cover,
        image_url: book.image_url,
        summary: parsedSummary,
        likes: book.likes
      }];
      res.status(200).json(formattedData);
    } catch (error) {
      console.error('데이터 변환 중 오류 발생:', error);
      res.status(500).send('데이터 변환 중 오류가 발생했습니다.');
    }
  });
});

// 라이브러리 페이지
app.get('/my-library', (req, res) => {
  const query = `
    SELECT 
      bi.id,
      bi.title,
      bc.image_url,
      bc.likes
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

// 서버 실행
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});