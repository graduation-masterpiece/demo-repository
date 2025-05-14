const dotenv = require('dotenv'); // dotenv 모듈 불러오기
const OpenAI = require('openai'); // OpenAI 모듈 불러오기
const fs = require('fs'); // 파일 시스템 모듈 불러오기
const path = require('path'); // 경로 모듈 불러오기
const db = require('../models/db'); // db.js에서 db 객체 가져오기
const axios = require('axios'); // axios 모듈 불러오기
dotenv.config(); // 환경 변수 로드

// AWS s3 클라이언트
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
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
        reject(new Error('Cannot find the book info.'));
      }
    });
  });
}

// 텍스트 요약 함수
async function summarizeText(title, text) {
  const prompt = `
    다음 텍스트는 책 "${title}"의 책 설명이야.
    
    1. 이 소설의 핵심 갈등과 분위기를 한국어로 2~3문장으로 간결하게 요약해 줘.
    2. 이 요약을 바탕으로 독자의 흥미를 끌 수 있는 감각적인 소개글을 작성해 줘.
       - 첫 문장은 강렬한 질문이나 인상적인 문장으로 시작해 줘.
       - 이야기의 갈등이나 분위기를 자연스럽게 드러내야 해.
       - 전체 글은 500자 이내여야 해.
       - *사랑*, *절망* 등 소설 분위기를 대표하는 핵심 단어를 *형식*으로 2~3개만 사용해 줘 (한 문장에 하나씩).
    
    줄바꿈이나 추가적인 설명, 코드 블록은 포함하지 마.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `
            You are a literary assistant specializing in summarizing novels in a compelling and concise way.

            Your tasks:
            1. Extract the core conflict and atmosphere of the novel based on the user-provided description in Korean.
            2. Create a short summary (2–3 sentences), then write a book teaser that:
               - Starts with a powerful question or striking sentence.
               - Conveys the novel’s tone and conflict naturally.
               - Does not exceed 500 characters.
               - Highlights 2 to 3 thematic keywords (like *love*, *betrayal*) in *italic* format, one per sentence.
            3. Do not add extra comments, explanations, or code blocks.`
        },
        { role: 'user', content: `${text}\n\n${prompt}` }
      ],
      max_tokens: 600
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
  const prompt = `${summary}
  
    다음 소설 설명을 바탕으로 분위기, 시대, 등장인물의 카테고리를 간단히 분석해 주세요.
    그리고 분석을 바탕으로 이미지 생성에 사용할 구체적인 프롬프트를 작성해 주세요.
    
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
        {
          role: 'system',
          content:
            `You are a creative assistant skilled at analyzing fictional texts and generating rich, descriptive prompts for image generation.
            
            Your task:
            1. Analyze the provided novel description to identify:
               - Mood (e.g., peaceful, hopeful, tense)
               - Time period (e.g., 1970s Korea, futuristic, fantasy world)
               - Characters (e.g., a woman in her 20s, a man in his 30s; infer ethnicity based on country of origin if unclear)
            2. Generate an image prompt based on your analysis.
               - Include mood, time period, characters, background, color scheme, and symbolic elements.
               - Do not include any text in the image.
               - Avoid violent or disturbing content.
               - The image should reflect the story’s atmosphere and world.
            
            Respond only in the format specified by the user.`
        },
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
    const bucketName = 'bookcard-images';
    const s3Key = `images/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: imageResponse.data,
      ContentType: 'image/png',
      ACL: 'public-read'
    });

    await s3.send(command);

    // S3에 업로드된 이미지 URL 구성
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
    console.error('Book processing error: ', error);
    throw error;
  }
}

module.exports = { processBook }; // processBook 함수를 내보냄
