const fs = require('fs'); // 파일 시스템 모듈 불러오기
const path = require('path'); // 경로 모듈 불러오기
const db = require('./db'); // db.js에서 db 객체 가져오기
const axios = require('axios'); // axios 모듈 불러오기
const { OpenAI } = require('openai'); // OpenAI 모듈 불러오기
const dotenv = require('dotenv'); // dotenv 모듈 불러오기
dotenv.config(); // 환경 변수 로드

// AWS s3 클라이언트
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: 'AKIA6ODU7ZD4MNCZYCTT',
    secretAccessKey: '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'
  }
});

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.GPT_API_KEY
});

// 책 정보를 데이터베이스에서 가져오는 함수
async function getBookInfo(id) {
  return new Promise((resolve, reject) => {
    // 쿼리 실행 전 id 값 확인
    console.log('Searching for book with id:', id);

    const query = 'SELECT title, description FROM book_info WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results.length > 0) {
        resolve(results[0]);
      } else {
        reject(new Error('책 정보를 찾을 수 없습니다.'));
      }
    });
  });
}

// 텍스트 요약 함수
async function summarizeText(title, text) {
  const summaryPrompt = `
  다음 텍스트는 소설 "${title}"의 책 설명이야. 
  이 서평을 바탕으로 독자의 흥미를 끄는 간결한 소설 소개글을 작성해줘. 
  소개글은 독자가 이 책을 꼭 읽고 싶어지도록 핵심 갈등이나 분위기를 암시하는 문장을 포함하며, 강렬한 질문이나 인상적인 문장으로 시작해줘. 
  최종 글은 최대 500자 이내로 작성해줘. 
  그리고 생성된 글에서 소설의 분위기를 대표하는 핵심 단어는 *단어* 형식으로 표시해줘. 
  예를 들어, 핵심 단어가 사랑이라면, *사랑* 이런 식으로 표시해줘. 
  핵심 단어는 한 문장에 하나만 있고, 전체적으로 2~3개로 제한해줘.
  추가적인 설명이나 코드 블록은 포함하지 마. 
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: summaryPrompt }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content.trim();

  } catch (error) {
    console.error('Summarization error:', error);
    throw error;
  }
}

// 요약된 텍스트를 문장 기준으로 나누는 함수
function splitTextIntoSentences(text) {
  // 모든 연속된 공백을 단일 공백으로 변경
  text = text.replace(/\s+/g, ' ').trim();
  text = text.replace(/"/g, ''); // 모든 따옴표 제거
  
  // 정규식을 사용해 문장 분리 후 각 문장의 앞뒤 공백 제거
  return text.match(/[^.!?]+[.!?]+/g)
    .map(sentence => sentence.trim());
}

// 이미지 생성 프롬프트 수정 함수
async function modifyPrompt(summary) {
  const prompt = summary +
    `
    위 내용은 소설의 설명문이야. 이 설명을 바탕으로 소설의 분위기, 시대, 등장인물을 분석하여 카테고리별 결과를 출력하고, 해당 분석을 토대로 이미지를 생성할 수 있는 상세한 이미지 프롬프트를 작성해줘.

    요청 사항:
    1. 소설의 분위기, 시대, 등장인물을 분석하여 각각의 카테고리 결과를 출력해 줘.
       - 분위기: 예시 - 고요함, 희망적, 긴장감 등
       - 시대: 예시 - 1970년대 한국, 미래, 판타지 세계 등
       - 등장인물: 예시 - 20대 여성, 30대 남성 주인공 1명 등
         (등장인물의 인종에 대한 정보가 부족하면 소설의 출처가 되는 나라를 참고)
    2. 카테고리 분석을 기반으로 이미지를 생성할 수 있는 프롬프트를 작성해 줘.
       - 분위기, 시대, 등장인물, 배경, 색감, 상징적인 요소들을 포함한 이미지 프롬프트
       - 이미지에는 텍스트가 전혀 없어야 해. 
       - 폭력적이거나 불쾌함을 주는 요소가 없어야 해. 
       - 이미지는 해당 소설의 분위기와 세계관을 잘 반영하도록 해 줘.

    출력 형식:
    1. 카테고리 분석 결과:
       - 분위기: [분석된 분위기]
       - 시대: [분석된 시대]
       - 등장인물: [분석된 등장인물]

    2. 이미지 생성 프롬프트:
       [생성된 이미지 프롬프트] 
    `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Prompt modification error:', error);
    throw error;
  }
}

// 이미지 생성 함수
async function generateImage(prompt, size = '1024x1024') {

  console.log(prompt)

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: size
    });

    // 이미지 URL에서 이미지 다운로드
    const imageUrl = response.data[0].url;
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    // S3에 업로드하기 위한 파일명 생성
    const fileName = `${Date.now()}.png`;
    const bucketName = 'bookcard-images'; // .env에 정의된 S3 버킷 이름
    const s3Key = `images/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: imageResponse.data,
      ContentType: 'image/png',
      ACL: 'public-read'
    });

    await s3.send(command);

    // S3에 업로드된 이미지 URL 구성 (리전에 따라 URL 형식이 다를 수 있음)
    const s3Url = `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/${s3Key}`;
    return s3Url;

  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
}

// 북카드 만드는 메인 함수 (텍스트 요약 + 이미지 생성)
async function processBook(id) {
  try {
    const bookInfo = await getBookInfo(id);
    const { title, description } = bookInfo;

    // 1. 책 description 내용으로 책 요약문(소개글 작성)
    const summary = await summarizeText(title, description);

    // 2. 작성된 책 요약문 문장 단위로 나누기
    const splitSummary = splitTextIntoSentences(summary);

    // 3. splitSummary를 JSON 형태로 변환
    const jsonSummary = JSON.stringify(splitSummary);

    // 4. 책 요약문으로 이미지 생성 후 다운로드
    const modifiedPrompt = await modifyPrompt(description);
    const imagePath = await generateImage(modifiedPrompt);

    return {
      title: title,
      summary: jsonSummary,
      imagePath: imagePath
    };
  } catch (error) {
    console.error('Book processing error:', error);
    throw error;
  }
}

module.exports = { processBook }; // processBook 함수를 내보냄
