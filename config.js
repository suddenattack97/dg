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