const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');

// itemList 엘리먼트에서 아이템 정보 추출
const extractItems = (html, region, regionCode) => {
  const $ = cheerio.load(html);
  const items = [];
  
  // Parsing the JSON-LD data from script tag which contains structured data
  try {
    const scriptContent = $('script[type="application/ld+json"]').html();
    if (scriptContent) {
      const jsonData = JSON.parse(scriptContent);
      if (jsonData && jsonData['@type'] === 'ItemList' && jsonData.itemListElement) {
        jsonData.itemListElement.forEach(listItem => {
          if (listItem && listItem.item) {
            const item = listItem.item;
            
            // Extract required information
            const name = item.name || '';
            const description = item.description || '';
            const image_url = item.image || '';
            const url = item.url || '';
            let price = '0';
            let seller = '';
            
            // Extract seller name
            if (item.offers && item.offers.seller && item.offers.seller.name) {
              seller = item.offers.seller.name;
            }
            
            // Generate a unique ID for the item using image URL or other unique properties
            const item_id = generateItemId(url, image_url, name, seller);
            
            items.push({
              item_id,
              name,
              description,
              price,
              image_url,
              url,
              seller,
              region,
              region_code: regionCode
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('JSON-LD 데이터 파싱 중 오류:', error);
  }
  
  return items;
};

// 아이템에 대한 고유 ID 생성
const generateItemId = (url, imageUrl, name, seller) => {
  // URL 또는 이미지 URL에서 고유 식별자 추출
  let uniqueString = '';
  
  // URL에서 마지막 경로 부분 추출 (아이템 ID가 포함될 가능성이 높음)
  if (url) {
    const urlParts = url.split('/');
    uniqueString = urlParts[urlParts.length - 2] || '';
  }
  
  // 고유 식별자가 추출되지 않았다면 이미지 URL 사용
  if (!uniqueString && imageUrl) {
    uniqueString = imageUrl;
  }
  
  // 여전히 고유 식별자가 없다면 이름과 판매자 조합 사용
  if (!uniqueString) {
    uniqueString = `${name}-${seller}`;
  }
  
  // SHA-256 해시 생성 (더 짧은 해시가 필요하면 substring 사용)
  return crypto.createHash('sha256').update(uniqueString).digest('hex');
};

// 웹페이지 스크래핑
const scrapeWebpage = async (url, region, regionCode) => {
  try {
    console.log(`스크래핑 시작: ${region} (${url})`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    
    if (response.status === 200) {
      const items = extractItems(response.data, region, regionCode);
      console.log(`${region}에서 ${items.length}개의 아이템을 찾았습니다.`);
      return items;
    } else {
      console.error(`스크래핑 실패: 응답 코드 ${response.status}`);
      return [];
    }
  } catch (error) {
    console.error(`스크래핑 중 오류 발생: ${error.message}`);
    return [];
  }
};

module.exports = {
  scrapeWebpage
}; 