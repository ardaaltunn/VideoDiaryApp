import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { VideoItem } from '../types/video.types';

// SQLite veritabanını aç
const openDatabase = () => {
  if (Platform.OS === "web") {
    return {
      transaction: () => ({
        executeSql: () => {},
      }),
    };
  }
  return SQLite.openDatabase("videodiary.db");
};

const db = openDatabase();

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS videos (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          uri TEXT NOT NULL,
          thumbnailUri TEXT NOT NULL,
          duration INTEGER,
          createdAt TEXT NOT NULL
        );`,
        [],
        () => resolve(true),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const videoDb = {
  saveVideo: (video: VideoItem): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO videos (
            id, title, description, uri, thumbnailUri, duration, createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            video.id,
            video.title,
            video.description,
            video.uri,
            video.thumbnailUri,
            video.duration,
            video.createdAt,
          ],
          (_, result) => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getAllVideos: (): Promise<VideoItem[]> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM videos ORDER BY createdAt DESC',
          [],
          (_, { rows: { _array } }) => resolve(_array as VideoItem[]),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getVideoById: (id: string): Promise<VideoItem | null> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM videos WHERE id = ?',
          [id],
          (_, { rows }) => resolve(rows.length > 0 ? rows.item(0) : null),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  deleteVideo: (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM videos WHERE id = ?',
          [id],
          (_, result) => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  // Yeni: Video güncelleme fonksiyonu
  updateVideo: (id: string, newTitle: string, newDescription: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE videos SET title = ?, description = ? WHERE id = ?',
          [newTitle, newDescription, id],
          (_, result) => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },
};
