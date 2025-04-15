require('dotenv').config();

// 모니터링할 지역 정보
// 나중에 더 많은 지역을 추가할 수 있도록 배열로 구성
const REGIONS = [
  {
    name: '봉천동',
    code: '6058',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%B4%89%EC%B2%9C%EB%8F%99-6058&only_on_sale=true&price=0__0'
  },
  {
    name: '신림동',
    code: '355',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%8B%A0%EB%A6%BC%EB%8F%99-355&only_on_sale=true&price=0__0'
  },
  {
    name: '대학동',
    code: '358',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%8C%80%ED%95%99%EB%8F%99-358&only_on_sale=true&price=0__0'
  },
  {
    name: '낙성대동',
    code: '345',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%82%99%EC%84%B1%EB%8C%80%EB%8F%99-345&only_on_sale=true&price=0__0'
  },
  {
    name: '신림동',
    code: '355',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%8B%A0%EB%A6%BC%EB%8F%99-355&only_on_sale=true&price=0__0'
  },
  {
    name: '난곡동',
    code: '361',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%82%9C%EA%B3%A1%EB%8F%99-361&only_on_sale=true&price=0__0'
  },
  {
    name: '은천동',
    code: '347',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%9D%80%EC%B2%9C%EB%8F%99-347&only_on_sale=true&price=0__0'
  },
  {
    name: '행운동',
    code: '344',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%ED%96%89%EC%9A%B4%EB%8F%99-344&only_on_sale=true&price=0__0'
  },
  {
    name: '인헌동',
    code: '349',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%9D%B8%ED%97%8C%EB%8F%99-349&only_on_sale=true&price=0__0'
  },
  {
    name: '청룡동',
    code: '346',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%B2%AD%EB%A3%A1%EB%8F%99-346&only_on_sale=true&price=0__0'
  },
  {
    name: '성현동',
    code: '343',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%84%B1%ED%98%84%EB%8F%99-343&only_on_sale=true&price=0__0'
  },
  {
    name: '남현동',
    code: '350',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%82%A8%ED%98%84%EB%8F%99-350&only_on_sale=true&price=0__0'
  },
  {
    name: '조원동',
    code: '357',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%A1%B0%EC%9B%90%EB%8F%99-357&only_on_sale=true&price=0__0'
  },
  {
    name: '미성동',
    code: '360',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%AF%B8%EC%84%B1%EB%8F%99-360&only_on_sale=true&price=0__0'
  },
  {
    name: '서림동',
    code: '353',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%84%9C%EB%A6%BC%EB%8F%99-353&only_on_sale=true&price=0__0'
  },
  {
    name: '보라매동',
    code: '341',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%B3%B4%EB%9D%BC%EB%A7%A4%EB%8F%99-341&only_on_sale=true&price=0__0'
  },
  {
    name: '신사동',
    code: '354',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%8B%A0%EC%82%AC%EB%8F%99-354&only_on_sale=true&price=0__0'
  },
  {
    name: '서원동',
    code: '351',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%84%9C%EC%9B%90%EB%8F%99-351&only_on_sale=true&price=0__0'
  },
  {
    name: '삼성동',
    code: '359',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%82%BC%EC%84%B1%EB%8F%99-359&only_on_sale=true&price=0__0'
  },
  {
    name: '중앙동',
    code: '348',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%A4%91%EC%95%99%EB%8F%99-348&only_on_sale=true&price=0__0'
  },
  {
    name: '신원동',
    code: '352',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%8B%A0%EC%9B%90%EB%8F%99-352&only_on_sale=true&price=0__0'
  },
  {
    name: '난향동',
    code: '356',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%82%9C%ED%96%A5%EB%8F%99-356&only_on_sale=true&price=0__0'
  },
  {
    name: '청림동',
    code: '342',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%B2%AD%EB%A6%BC%EB%8F%99-342&only_on_sale=true&price=0__0'
  },
  // 광주시
  {
    name: '능평동',
    code: '11838',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%8A%A5%ED%8F%89%EB%8F%99-11838&only_on_sale=true&price=0__0'
  },
  {
    name: '오포읍',
    code: '1792',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%98%A4%ED%8F%AC%EB%8F%99-1792&only_on_sale=true&price=0__0'
  },
  {
    name: '초월읍',
    code: '1793',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%B4%88%EC%9B%94%EC%9D%8D-1793&only_on_sale=true&price=0__0'
  },
  {
    name: '태전동',
    code: '4451',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%ED%83%9C%EC%A0%84%EB%8F%99-4451&only_on_sale=true&price=0__0'
  },
  {
    name: '곤지암읍',
    code: '1794',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EA%B3%A4%EC%A7%80%EC%95%94%EC%9D%8D-1794&only_on_sale=true&price=0__0'
  },
  {
    name: '경안동',
    code: '1799',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EA%B2%BD%EC%95%88%EB%8F%99-1799&only_on_sale=true&price=0__0'
  },
  {
    name: '송정동',
    code: '1800',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%A1%B0%EC%84%B1%EB%8F%99-1800&only_on_sale=true&price=0__0'
  },
  {
    name: '신현동',
    code: '11837',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%8B%A0%ED%98%84%EB%8F%99-11837&only_on_sale=true&price=0__0'
  },
  {
    name: '탄벌동',
    code: '4240',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%ED%83%84%EB%B2%8C%EB%8F%99-4240&only_on_sale=true&price=0__0'
  },
  {
    name: '역동',
    code: '4447',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%97%AD%EB%8F%99-4447&only_on_sale=true&price=0__0'
  },
  {
    name: '쌍령동',
    code: '4446',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%8C%8D%EB%A0%B9%EB%8F%99-4446&only_on_sale=true&price=0__0'
  },
  {
    name: '목현동',
    code: '4444',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%AA%A9%ED%98%84%EB%8F%99-4444&only_on_sale=true&price=0__0'
  },
  {
    name: '퇴촌면',
    code: '1796',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%ED%87%B4%EC%B4%8C%EB%A9%B4-1796&only_on_sale=true&price=0__0'
  },
  {
    name: '장지동',
    code: '4448',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%9E%A5%EC%A7%80%EB%8F%99-4448&only_on_sale=true&price=0__0'
  },
  {
    name: '광남동',
    code: '1801',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EA%B4%91%EB%82%A8%EB%8F%99-1801&only_on_sale=true&price=0__0'
  },
  {
    name: '도척면',
    code: '1795',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%8F%84%EC%B2%99%EB%A9%B4-1795&only_on_sale=true&price=0__0'
  },
  {
    name: '양벌동',
    code: '11844',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%96%91%EB%B2%8C%EB%8F%99-11844&only_on_sale=true&price=0__0'
  },
  {
    name: '회덕동',
    code: '4452',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%ED%9A%8C%EB%8D%95%EB%8F%99-4452&only_on_sale=true&price=0__0'
  },
  {
    name: '고산동',
    code: '11839',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EA%B3%A0%EC%82%B0%EB%8F%99-11839&only_on_sale=true&price=0__0'
  },
  {
    name: '삼동',
    code: '4445',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%82%BC%EB%8F%99-4445&only_on_sale=true&price=0__0'
  },
  {
    name: '오포2동',
    code: '11836',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%98%A4%ED%8F%AC2%EB%8F%99-11836&only_on_sale=true&price=0__0'
  },
  {
    name: '문형동',
    code: '11840',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%AC%B8%ED%98%95%EB%8F%99-11840&only_on_sale=true&price=0__0'
  },
  {
    name: '중대동',
    code: '4449',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%A4%91%EB%8C%80%EB%8F%99-4449&only_on_sale=true&price=0__0'
  },
  {
    name: '오포1동',
    code: '11835',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%98%A4%ED%8F%AC1%EB%8F%99-11835&only_on_sale=true&price=0__0'
  },
  {
    name: '매산동',
    code: '11842',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%A7%A4%EC%82%B0%EB%8F%99-11842&only_on_sale=true&price=0__0'
  },
  {
    name: '남한산성면',
    code: '3993',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%82%A8%ED%95%9C%EC%82%B0%EC%84%B1%EB%A9%B4-3993&only_on_sale=true&price=0__0'
  },
  {
    name: '목동',
    code: '4443',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%AA%A9%EB%8F%99-4443&only_on_sale=true&price=0__0'
  },
  {
    name: '추자동',
    code: '11841',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%B6%94%EC%9E%90%EB%8F%99-11841&only_on_sale=true&price=0__0'
  },
  {
    name: '직동',
    code: '4450',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EC%A7%81%EB%8F%99-4450&only_on_sale=true&price=0__0'
  },
  {
    name: '남종면',
    code: '1797',
    url: 'https://www.daangn.com/kr/buy-sell/?in=%EB%82%A8%EC%A2%85%EB%A9%B4-1797&only_on_sale=true&price=0__0'
  },

  
  


  // 추가 지역은 여기에 추가하면 됨
  // 예: { name: '신림동', code: '1234', url: '...' }
];

// 체크 간격 (밀리초 단위)
const CHECK_INTERVAL = process.env.CHECK_INTERVAL || 3000;

// 이메일 설정
const EMAIL_CONFIG = {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  receiver: process.env.RECEIVER_EMAIL || 'minsu9788@office.kookje.ac.kr'
};

module.exports = {
  REGIONS,
  CHECK_INTERVAL,
  EMAIL_CONFIG
}; 