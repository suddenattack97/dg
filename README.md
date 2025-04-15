# 당근마켓 무료나눔 알림기

당근마켓의 무료나눔 게시물을 모니터링하고 새로운 아이템이 등록되면 이메일로 알림을 보내는 Node.js 애플리케이션입니다.

## 기능

- 당근마켓 무료나눔 게시물 자동 모니터링
- 새 아이템 발견 시 데이터베이스에 저장
- 새 아이템 발견 시 이메일 알림 발송
- 여러 지역을 로테이션으로 모니터링 가능

## 설치 및 실행

1. 필요한 패키지 설치:
   ```
   npm install
   ```

2. `.env` 파일 설정:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   RECEIVER_EMAIL=minsu9788@office.kookje.ac.kr
   ```

3. 애플리케이션 실행:
   ```
   node index.js
   ```

## 설정
`config.js` 파일에서 모니터링할 지역 및 조회 간격 등을 설정할 수 있습니다. 