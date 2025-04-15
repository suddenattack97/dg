const nodemailer = require('nodemailer');
const config = require('./config');

// 이메일 전송자 설정
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.naver.com',  // 네이버 SMTP 서버
    port: 465,               // 네이버 SMTP 포트 (465, SSL 필요)
    secure: true,            // SSL 설정 (보안 연결 필요)
    auth: {
      user: config.EMAIL_CONFIG.user,
      pass: config.EMAIL_CONFIG.pass
    },
    connectionTimeout: 10000, // 연결 타임아웃 10초로 설정
    greetingTimeout: 10000,   // 인사 타임아웃 10초로 설정
    socketTimeout: 30000      // 소켓 타임아웃 30초로 설정
  });
};

// 지연 함수 (밀리초 단위로 대기)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 새 아이템 발견 시 이메일 전송 (재시도 로직 포함)
const sendNewItemNotification = async (item, retryCount = 0, maxRetries = 3) => {
  try {
    const transporter = createTransporter();
    
    // 이미지 URL이 http://로 시작하는 경우 https://로 변경 (보안 이슈 해결)
    const imageUrl = item.image_url.replace(/^http:\/\//i, 'https://');
    
    // 이메일 본문 HTML
    const htmlContent = `
      <h2>당근마켓 무료나눔 새 아이템 알림</h2>
      <p><strong>지역:</strong> ${item.region}</p>
      <p><strong>물품명:</strong> ${item.name}</p>
      <p><strong>설명:</strong> ${item.description.substring(0, 200)}${item.description.length > 200 ? '...' : ''}</p>
      <p><strong>판매자:</strong> ${item.seller}</p>
      <div style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">(이미지가 보이지 않으면 '외부 이미지 표시' 옵션을 선택해주세요)</p>
        <img src="${imageUrl}" alt="${item.name}" style="max-width: 300px; max-height: 300px; border: 1px solid #ddd;">
      </div>
      <p>
        <a href="${item.url}" style="background-color: #FF8A3D; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
          당근마켓에서 보기
        </a>
      </p>
      <p style="color: #999; font-size: 11px; margin-top: 30px;">
        이 메일은 당근마켓 무료나눔 알림기에 의해 자동으로 전송되었습니다.
      </p>
    `;
    
    // 이메일 옵션
    const mailOptions = {
      from: `"당근마켓 알림" <${config.EMAIL_CONFIG.user}>`,  // 표시 이름 추가
      to: config.EMAIL_CONFIG.receiver,
      subject: `[당근알림] ${item.region}의 새 무료나눔: ${item.name}`,
      html: htmlContent,
      headers: {
        'X-Priority': '1',  // 높은 우선순위
        'X-Mailer': 'DaangnAlert'
      }
    };
    
    // 이메일 전송
    const info = await transporter.sendMail(mailOptions);
    console.log(`이메일 전송 완료: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('이메일 전송 중 오류 발생:', error);
    
    // ECONNRESET 오류 또는 기타 네트워크 관련 오류일 경우 재시도
    if ((error.code === 'ESOCKET' || error.code === 'ECONNRESET' || 
         error.code === 'ETIMEDOUT' || error.code === 'EPIPE') && 
        retryCount < maxRetries) {
      
      const waitTime = 5000 * (retryCount + 1);  // 점진적으로 대기 시간 증가 (5초, 10초, 15초)
      console.log(`연결 오류로 ${waitTime/1000}초 후 재시도 중... (${retryCount + 1}/${maxRetries})`);
      
      await delay(waitTime);
      return sendNewItemNotification(item, retryCount + 1, maxRetries);
    }
    
    return false;
  }
};

module.exports = {
  sendNewItemNotification
}; 