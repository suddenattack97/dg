const { scrapeWebpage } = require('./scraper');
const db = require('./db');
const mailer = require('./mailer');
const config = require('./config');

// 현재 조회 중인 지역 인덱스
let currentRegionIndex = 0;

// 연속 이메일 전송 횟수 제한
const MAX_EMAILS_PER_BATCH = 3;
// 이메일 전송 제한에 도달했을 때 대기 시간 (밀리초)
const EMAIL_COOLDOWN_TIME = 5000; // 5분에서 5초로 감소

// 이메일 전송 간 최소 대기 시간 (밀리초)
const MIN_EMAIL_INTERVAL = 1000; // 10초에서 1초로 감소
const MAX_EMAIL_INTERVAL = 3000; // 15초에서 3초로 감소

// 지연 함수 (milliseconds 만큼 대기)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 새 아이템 발견 시 처리
const processNewItems = async (items) => {
  let newItemCount = 0;
  let consecutiveErrors = 0; // 연속 오류 횟수 추적
  
  for (const item of items) {
    try {
      // 아이템 저장 및 중복 체크
      const { exists } = await db.saveItem(item);
      
      // 새 아이템이면 이메일 전송
      if (!exists) {
        newItemCount++;
        console.log(`새 아이템 발견: ${item.name}`);
        
        // 연속 오류가 3번 이상 발생한 경우에만 대기
        if (consecutiveErrors >= 3) {
          console.log(`연속 ${consecutiveErrors}회 이메일 전송 오류 발생, ${EMAIL_COOLDOWN_TIME/1000}초 대기 중...`);
          await delay(EMAIL_COOLDOWN_TIME);
          consecutiveErrors = 0; // 오류 카운터 초기화
        }
        
        // 이메일 전송 전 잠시 대기 (연속 전송 방지)
        const waitTime = MIN_EMAIL_INTERVAL + Math.random() * (MAX_EMAIL_INTERVAL - MIN_EMAIL_INTERVAL);
        await delay(waitTime); // 1-3초 랜덤 대기
        
        try {
          const success = await mailer.sendNewItemNotification(item);
          if (success) {
            consecutiveErrors = 0; // 성공하면 오류 카운터 초기화
            console.log(`이메일 전송 성공: ${item.name}`);
          } else {
            consecutiveErrors++; // 실패하면 오류 카운터 증가
            console.log(`이메일 전송 실패 (연속 ${consecutiveErrors}회 오류): ${item.name}`);
          }
        } catch (emailError) {
          consecutiveErrors++; // 예외가 발생해도 오류 카운터 증가
          console.error(`이메일 전송 중 예외 발생 (연속 ${consecutiveErrors}회 오류): ${emailError.message}`);
        }
      }
    } catch (error) {
      console.error(`아이템 처리 중 오류 발생: ${error.message}`);
      // 오류가 발생해도 계속 진행
      continue;
    }
  }
  
  console.log(`총 ${items.length}개 아이템 중 ${newItemCount}개의 새 아이템 발견`);
};

// 다음 지역으로 이동
const moveToNextRegion = () => {
  currentRegionIndex = (currentRegionIndex + 1) % config.REGIONS.length;
  return config.REGIONS[currentRegionIndex];
};

// 지역 로테이션으로 스크래핑 수행
const rotationScraping = async () => {
  // 현재 지역 정보 가져오기
  const region = config.REGIONS[currentRegionIndex];
  
  try {
    console.log(`======= ${region.name} 지역 스크래핑 시작 =======`);
    
    // 스크래핑 수행
    const items = await scrapeWebpage(region.url, region.name, region.code);
    
    if (items.length > 0) {
      console.log(`${region.name}에서 ${items.length}개의 아이템을 발견했습니다. 모든 아이템을 처리합니다...`);
      
      // 새 아이템 처리 (모든 아이템 처리가 완료될 때까지 기다림)
      await processNewItems(items);
      
      console.log(`${region.name} 지역의 모든 아이템 처리 완료`);
    } else {
      console.log(`${region.name}에서 아이템을 찾지 못했습니다.`);
    }
    
    // 다음 지역으로 이동 (모든 아이템 처리 후)
    const nextRegion = moveToNextRegion();
    console.log(`다음 스크래핑 지역: ${nextRegion.name}`);
    console.log(`======= ${region.name} 지역 스크래핑 완료 =======\n`);
    
  } catch (error) {
    console.error(`스크래핑 작업 오류: ${error.message}`);
    // 오류가 발생해도 다음 지역으로 이동
    moveToNextRegion();
  }
};

// 애플리케이션 시작
const startApp = async () => {
  try {
    // DB 초기화
    await db.initDb();
    
    console.log('당근마켓 무료나눔 알림기 시작됨');
    console.log(`모니터링 중인 지역: ${config.REGIONS.map(r => r.name).join(', ')}`);
    console.log(`체크 간격: ${config.CHECK_INTERVAL}ms`);
    
    // 초기 스크래핑 수행 및 주기적 스크래핑 설정
    // 각 스크래핑이 완전히 완료된 후에만 다음 스크래핑 실행
    const runScrapingCycle = async () => {
      await rotationScraping();
      setTimeout(runScrapingCycle, config.CHECK_INTERVAL);
    };
    
    // 스크래핑 사이클 시작
    runScrapingCycle();
    
  } catch (error) {
    console.error(`애플리케이션 실행 오류: ${error.message}`);
    process.exit(1);
  }
};

// 프로세스 종료 시 정리 작업
process.on('SIGINT', async () => {
  console.log('\n애플리케이션 종료 중...');
  try {
    await db.closeDb();
    console.log('정상적으로 종료되었습니다.');
    process.exit(0);
  } catch (error) {
    console.error(`종료 중 오류 발생: ${error.message}`);
    process.exit(1);
  }
});

// 애플리케이션 시작
startApp(); 