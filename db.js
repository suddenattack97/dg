const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 데이터베이스 연결
const dbPath = path.join(__dirname, 'daangn_items.db');
const db = new sqlite3.Database(dbPath);

// 테이블 초기화
const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 아이템 정보를 저장하는 테이블 생성
      db.run(`
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          item_id TEXT UNIQUE,
          name TEXT,
          description TEXT,
          price TEXT,
          image_url TEXT,
          url TEXT,
          seller TEXT,
          region TEXT,
          region_code TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('테이블 생성 중 오류 발생:', err);
          reject(err);
        } else {
          console.log('데이터베이스 초기화 완료');
          resolve();
        }
      });
    });
  });
};

// 아이템 저장
const saveItem = (item) => {
  return new Promise((resolve, reject) => {
    const {
      item_id,
      name,
      description,
      price,
      image_url,
      url,
      seller,
      region,
      region_code
    } = item;

    db.run(
      `INSERT INTO items 
      (item_id, name, description, price, image_url, url, seller, region, region_code) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item_id, name, description, price, image_url, url, seller, region, region_code],
      function(err) {
        if (err) {
          // SQLite error code 19는 UNIQUE constraint 위반 (이미 존재하는 아이템)
          if (err.errno === 19) {
            resolve({ exists: true, id: null });
          } else {
            console.error('아이템 저장 중 오류 발생:', err);
            reject(err);
          }
        } else {
          console.log(`새 아이템 저장됨: ${name} (ID: ${this.lastID})`);
          resolve({ exists: false, id: this.lastID });
        }
      }
    );
  });
};

// 아이템 존재 여부 확인
const itemExists = (itemId) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id FROM items WHERE item_id = ?',
      [itemId],
      (err, row) => {
        if (err) {
          console.error('아이템 조회 중 오류 발생:', err);
          reject(err);
        } else {
          resolve(!!row);
        }
      }
    );
  });
};

// 데이터베이스 닫기
const closeDb = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error('데이터베이스 닫기 중 오류 발생:', err);
        reject(err);
      } else {
        console.log('데이터베이스 연결 종료');
        resolve();
      }
    });
  });
};

module.exports = {
  initDb,
  saveItem,
  itemExists,
  closeDb
}; 