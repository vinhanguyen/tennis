import { Point } from "./point";

const DB_NAME = 'tennis';
const DB_VERSION = 2;

function handleUpgrade({target: {result: db}}: any) {
  db.deleteObjectStore('points');
  db.createObjectStore('points', {autoIncrement: true});  
}

export function addPoint(point: Point): Promise<Point> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, DB_VERSION);
  
    open.onupgradeneeded = handleUpgrade;
  
    open.onerror = ({target: error}) => {
      reject(error);
    };
  
    open.onsuccess = ({target: {result: db}}: any) => {
      const add = db.transaction(['points'], 'readwrite')
        .objectStore('points')
        .add(point);
      
      add.onsuccess = () => {
        resolve({...point});
      };
  
      add.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

export function getLastPoint(): Promise<Point|null> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, DB_VERSION);
  
    open.onupgradeneeded = handleUpgrade;
  
    open.onerror = ({target: error}) => {
      reject(error);
    };
  
    open.onsuccess = ({target: {result: db}}: any) => {
      const openCursor = db.transaction(['points'], 'readonly')
        .objectStore('points')
        .openCursor(null, 'prev');

      openCursor.onsuccess = ({target: {result: cursor}}: any) => {
        if (cursor) {
          resolve(cursor.value);
        } else {
          resolve(null);
        }
      }
  
      openCursor.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

export function deleteLastPoint(): Promise<number|null> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, DB_VERSION);
  
    open.onupgradeneeded = handleUpgrade;
  
    open.onerror = ({target: error}) => {
      reject(error);
    };
  
    open.onsuccess = ({target: {result: db}}: any) => {
      const tx = db.transaction(['points'], 'readwrite');
      const store = tx.objectStore('points');

      const openKeyCursor = store.openKeyCursor(null, 'prev');

      openKeyCursor.onsuccess = ({target: {result: cursor}}: any) => {
        if (cursor) {
          const {key} = cursor;

          const remove = store.delete(key);

          remove.onsuccess = () => {
            resolve(key);
          };
        } else {
          resolve(null);
        }
      }
  
      tx.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}

export function deleteAllPoints(): Promise<number> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, DB_VERSION);
  
    open.onupgradeneeded = handleUpgrade;
  
    open.onerror = ({target: error}) => {
      reject(error);
    };
  
    open.onsuccess = ({target: {result: db}}: any) => {
      const tx = db.transaction(['points'], 'readwrite');
      const store = tx.objectStore('points');

      const getAllKeys = store.getAllKeys();

      getAllKeys.onsuccess = ({target: {result}}: any) => {
        let keys = [];
        for (const key of result) {
          const remove = store.delete(key);

          remove.onsuccess = () => {
            keys.push(key);
          };
        }
        resolve(keys.length);
      }
  
      tx.onerror = ({target: error}: any) => {
        reject(error);
      };
    };
  });
}
