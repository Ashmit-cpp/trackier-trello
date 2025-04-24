import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Project, User } from "./types";

interface MyDB extends DBSchema {
  users: { key: string; value: User };
  projects: { key: string; value: Project[] };
}

let dbPromise: Promise<IDBPDatabase<MyDB>>;
export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<MyDB>("app-db", 1, {
      upgrade(db) {
        db.createObjectStore("users");
        db.createObjectStore("projects");
      },
    });
  }
  return dbPromise;
}
export async function dbGet<T extends keyof MyDB>(store: T, key: IDBValidKey) {
  const db = await getDB();
  return db.get(store, key);
}
export async function dbSet<T extends keyof MyDB>(
  store: T,
  key: IDBValidKey,
  value: MyDB[T]["value"]
) {
  const db = await getDB();
  await db.put(store, value, key);
}
export async function dbDelete<T extends keyof MyDB>(
  store: T,
  key: IDBValidKey
) {
  const db = await getDB();
  await db.delete(store, key);
}
