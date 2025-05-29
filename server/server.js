require('dotenv').config(); // .env 파일 로드
const express = require('express');
const cors = require('cors');
const db = require('./db');
const { processBook } = require('./gpt');
const path = require('path');
const axios = require('axios');
const redis = require('redis');

const redisClient = redis.createClient({
  url: 'redis://localhost:6379' // Redis 서버 주소
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

const app = express();

console.log("🔥 Server Access Detected - Latest Code Executed");

// CORS 설정
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://3.38.107.4',
    'https://bookcard.site',
    'https://www.bookcard.site'],
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// body-parser 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 서버 준비 상태 확인
let isServerReady = false;

app.get('/health', (req, res) => {
  res.json({ ready: isServerReady });
});

// SNS 미리보기용 메타 URL
app.get('/meta/book/:bookId', async (req, res) => {
  const ua = req.headers['user-agent'] || '';
  const bookId = req.params.bookId;

  try {
    const response = await axios.get(`https://bookcard.site/api/book/${bookId}`);
    const book = response.data;

    const isBot = /facebook|kakao|twitter|Slack|Discord|LinkedIn/i.test(ua);

    if (!isBot) {
      // 일반 사용자면 React 페이지로 리디렉션
      return res.redirect(301, `https://bookcard.site/book/${bookId}`);
    }

    // SNS 크롤러에게는 OG 메타 포함된 HTML 응답
    res.render('book', {
      title: book.title,
      description: book.description || 'My Library Card',
      imageUrl: book.image_url,
      bookId: bookId
    });
  } catch (error) {
    console.error('/meta/book/:id Error:', error.message);
    res.status(500).send('Server Error - Meta');
  }
});

// 검색어 저장 및 자동완성 API
app.post('/api/search-history', async (req, res) => {
  const { query } = req.body;
  
  try {
    // 기존 검색어 삭제 후 재등록 (중복 방지)
    await redisClient.zRem('searchTerms', query.toLowerCase());
    await redisClient.zAdd('searchTerms', {
      score: Date.now(), 
      value: `${query.toLowerCase()}:${Date.now()}` // 타임스탬프 추가 저장
    });
    
    // 최대 200개 유지
    await redisClient.zRemRangeByRank('searchTerms', 0, -201);
    
    res.status(200).end();
  } catch (error) {
    console.error('Redis error:', error);
    res.status(500).end();
  }
});


// 자동완성 API (1글자 지원 버전)
app.get('/api/autocomplete', async (req, res) => {
  const { prefix } = req.query;
  
  if (!prefix) {
    return res.status(400).json({ error: 'Prefix is required' });
  }

  const normalizedPrefix = prefix.toLowerCase();
  
  try {
    // 최근 검색어 200개만 조회 (성능 최적화)
    const recentTerms = await redisClient.zRange('searchTerms', 0, 199, { REV: true });
    
    // 1글자 검색 필터링 로직
    const suggestions = recentTerms
      .map(term => term.split(':')[0]) // 타임스탬프 제거
      .filter(term => term.startsWith(normalizedPrefix))
      .filter((value, index, self) => self.indexOf(value) === index) // 중복 제거
      .slice(0, 10);

    res.setHeader('Cache-Control', 'no-store'); // 304 에러 방지
    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Redis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// 네이버 API 프록시 엔드포인트
app.get('/api/naver-search', async (req, res) => {

  let query = req.query.query;
  const display = req.query.display || 10;
  const start = req.query.start || 1;

  try {
    const response = await axios.get('https://openapi.naver.com/v1/search/book.json', {
      params: { query, display, start },
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
        'User-Agent': 'Mozilla/5.0'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Naver API Request Failed: ', error);
    res.status(500).json({ error: 'Naver API Request Failed.', details: error.response ? error.response.data : error.message });
  }
});

// 책 정보 저장 API
app.post('/api/book', async (req, res) => {
  console.log('Request Body: ', req.body);
  const { isbn, title, author, publisher, pubdate, description, book_cover } = req.body;

  const cleanTitle = title.replace(/\s*\(.*?\)/, '');

  try {
    // 1. book_info 저장
    const insertBookInfoQuery = `
      INSERT INTO book_info (id, title, author, publisher, published_date, description, book_cover) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const bookInfoValues = [isbn, cleanTitle, author, publisher, pubdate, description, book_cover];

    db.query(insertBookInfoQuery, bookInfoValues, async (err, result) => {
      if (err) {
        console.error('MySQL Error:', err);

        // ISBN 중복 특별 처리 (ER_DUP_ENTRY 코드 1062)
        if (err.code === 'ER_DUP_ENTRY') {
          // 이미 존재하는 경우에도 200 OK로 응답
          return res.status(200).json({
            alreadyExists: true,
            message: "Book already exists in database"
          });
        }

        return res.status(500).json({
          error: 'Book Info Saving Error',
          details: err.message
        });
      }

      try {
        // 2. 이미지 및 요약 생성
        const imageResult = await processBook(isbn);
        const imagePath = imageResult.imagePath;
        const summary = imageResult.summary;

        // 3. book_card 저장
        const insertBookCardQuery = `
          INSERT INTO book_card (image_url, summary, book_info_id, likes) 
          VALUES (?, ?, ?, ?)`;
        const bookCardValues = [imagePath, summary, isbn, 0];

        db.query(insertBookCardQuery, bookCardValues, (err) => {
          if (err) {
            console.error('MySQL Error:', err);
            return res.status(500).json({
              error: 'Book Card Saving Error',
              details: err.message
            });
          }
          
          res.status(200).json({
            alreadyExists: false,
            message: 'Book created successfully',
            imageUrl: imagePath,
            summary: summary
          });
        });

      } catch (imageError) {
        console.error('Image Processing Error:', imageError);
        res.status(500).json({
          error: 'Image Processing Failed',
          details: imageError.message
        });
      }
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
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
      console.error('An Error has occurred during MySQL Query execution:', err);
      return res.status(500).send('Server Error - Loading All Book Cards');
    }

    if (results.length === 0) {
      return res.status(404).send('Cannot fine the book.');
    }

    try {
      const formattedData = results.map(book => {
        let parsedSummary;
        // summary가 있으면 JSON.parse 시도
        if (typeof book.summary === 'string') {
          try {
            parsedSummary = JSON.parse(book.summary); // 배열로 복원
          } catch (parseErr) {
            console.error('JSON Parsing Error: ', parseErr);
            // 파싱 실패 시 빈 배열로 처리 (또는 원본 유지)
            parsedSummary = [];
          }
        } else {
          parsedSummary = book.summary;
        }

        return {
          id: book.id,
          title: book.title,
          author: book.author,
          book_cover: book.book_cover,
          image_url: book.image_url,
          likes: book.likes,
          summary: parsedSummary  // 배열 형태
        };
      });

      res.status(200).json(formattedData);
    } catch (error) {
      console.error('An error has occurred during formatting the data:', error);
      res.status(500).send('An error has occurred during formatting the data.');
    }
  });
});

// 책 삭제 API
app.delete('/api/book/:id', (req, res) => {
  const bookId = req.params.id;

  // book_card 테이블에서 먼저 삭제
  const deleteBookCardQuery = `DELETE FROM book_card WHERE book_info_id = ?`;
  db.query(deleteBookCardQuery, [bookId], (err) => {
    if (err) {
      console.error('An error has occurred during deletion in book_card: ', err);
      return res.status(500).json({ error: 'An error has occurred during deletion in book_card.' });
    }

    // book_info 테이블에서 삭제
    const deleteBookInfoQuery = `DELETE FROM book_info WHERE id = ?`;
    db.query(deleteBookInfoQuery, [bookId], (err) => {
      if (err) {
        console.error('An error has occurred during deletion in book_info: ', err);
        return res.status(500).json({ error: 'An error has occurred during deletion in book_info.' });
      }

      // error_reports 테이블에서 삭제
      const deleteErrorReportQuery = `DELETE FROM error_reports WHERE book_info_id = ?`;
      db.query(deleteErrorReportQuery, [bookId], (err) => {
        if (err) {
	  console.error('An error has occurred during deletion in error_reports: ', err);
	  return res.status(500).json({ error: 'An error has occurred during deletion in error_reports.' });
	}
	
      	res.status(200).json({ message: 'The book data has deleted successfully, including related error reports.' });
      });
    });
  });
});

const requestIp = require('request-ip');

app.patch('/api/book/:id/like', async (req, res) => {
  const bookId = req.params.id;
  const clientIp = requestIp.getClientIp(req); // IP 추출

  try {
    // 1. 중복 좋아요 체크
    const isLiked = await redisClient.get(`liked:${bookId}:${clientIp}`);
    if (isLiked) {
      return res.status(400).json({ error: 'Can only do it once within 24 hours.' });
    }

    // 2. 좋아요 수 증가
    const updateLikeQuery = `
      UPDATE book_card
      SET likes = likes + 1
      WHERE book_info_id = ?
    `;
    const [result] = await db.promise().query(updateLikeQuery, [bookId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cannot find the book.' });
    }

    // 3. Redis에 기록 (24시간 유지)
    await redisClient.set(`liked:${bookId}:${clientIp}`, '1', { EX: 86400 });
    
    // 4. 새로운 좋아요 수 반환
    const [rows] = await db.promise().query(
      'SELECT likes FROM book_card WHERE book_info_id = ?',
      [bookId]
    );
    
    res.status(200).json({ likes: rows[0].likes });
  } catch (error) {
    console.error('Likes processing error: ', error);
    res.status(500).json({ error: 'Server Error - Likes Increment' });
  }
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
      console.error('An Error has occurred during MySQL Query execution: ', err);
      return res.status(500).send('Server Error - Loading Specific Book Info');
    }

    if (results.length === 0) {
      return res.status(404).send('Cannot find the book.');
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
      console.error('An error has occurred during formatting the data: ', error);
      res.status(500).send('An error has occurred during formatting the data.');
    }
  });
});

app.get('/api/my-library', (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 12;
  const sort = req.query.sort || 'default';

  let orderBy = 'bi.id ASC'; // 기본순
  if (sort === 'latest') {
    orderBy = 'bc.generate_date DESC'; // 생성순
  } else if (sort === 'likes') {
    orderBy = 'bc.likes DESC'; // 좋아요순
  }

  const offset = page * itemsPerPage;

  // 1. 전체 개수 쿼리
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM book_info bi
    LEFT JOIN book_card bc ON bi.id = bc.book_info_id
  `;

  // 2. 페이지 데이터 쿼리
  const dataQuery = `
    SELECT bi.id, bi.title, bc.image_url, bc.likes
    FROM book_info bi
    LEFT JOIN book_card bc ON bi.id = bc.book_info_id
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  db.query(countQuery, (err, countResults) => {
    if (err) {
      console.error('An error has occurred during MySQL Query execution: ', err);
      return res.status(500).send('Server Error - CountQuery');
    }
    const total = countResults[0].total;

    db.query(dataQuery, [itemsPerPage, offset], (err, dataResults) => {
      if (err) {
        console.error('An error has occurred during MySQL Query execution: ', err);
        return res.status(500).send('Server Error - DataQuery');
      }
      // books와 total을 함께 반환
      res.status(200).json({ books: dataResults, total });
    });
  });
});

// 오류 신고
app.post('/api/error-report', async (req, res) => {
  const { book_info_id, error_type, report_time } = req.body;

  const reportQuery = `insert into error_reports (book_info_id, error_type, report_time) values (?, ?, ?)`;

  db.query(reportQuery, [book_info_id, error_type, report_time], (err) => {
    if (err) {
      console.error('Failed to report the error: ', err);
      return res.status(500).json({ error: 'Failed to report the error.' });
    }
    
    res.status(200).json({ message: 'Reporting error complete.' });
  });
});

// UTM 로깅
app.post('/api/log-utm', (req, res) => {
  console.log("Request Body: ", req.body);
	
  let { source, medium, campaign, content, access_time } = req.body;

  if (!req.body || Object.keys(req.body).length == 0) {
    source = 'direct';
    medium = 'none';
    campaign = 'direct-access';
    content = 'null';
    access_time = new Date().toISOString();
  }
  
  console.log(`[UTM LOG] source=${source}, medium=${medium}, campaign=${campaign}, content=${content}, access_time=${access_time}`);

  const utmLogQuery = `insert into utm_logs (utm_source, utm_medium, utm_campaign, utm_content, access_time) values (?, ?, ?, ?, ?)`;

  db.query(utmLogQuery, [source, medium, campaign, content, access_time], (err) => {
    if (err) {
      console.error('Failed to log the utm: ', err.response?.data || err);
      return res.status(500).json({ error: 'Failed to log the utm.' });
    }

    res.status(200).json({ message: 'Logging the UTM complete.' });
  });
});

// ✅ React fallback 설정 (API, META 제외)
app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('*', (req, res, next) => {
  const excludedPaths = ['/api', '/meta'];
  
  if (excludedPaths.some(prefix => req.path.startsWith(prefix)) || req.path === '/health') next();
  else res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// 서버 실행
const PORT = 5001;
app.listen(PORT, () => {
  isServerReady = true;
  console.log(`The server is running at: https://bookcard.site/`);
});
