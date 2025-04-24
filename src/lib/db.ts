import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Project, User } from "./types";

interface MyDB extends DBSchema {
  users: { key: string; value: User };
  projects: { key: string; value: Project[] };
}

// Union of your object‐store names
type StoreName = keyof MyDB;

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

export async function dbGet<K extends StoreName>(
  store: K,
  key: IDBValidKey
): Promise<MyDB[K]["value"] | undefined> {
  const db = await getDB();
  // cast to any to bypass the literal‐only restriction
  return (db as any).get(store, key) as MyDB[K]["value"] | undefined;
}

export async function dbSet<K extends StoreName>(
  store: K,
  key: IDBValidKey,
  value: MyDB[K]["value"]
): Promise<void> {
  const db = await getDB();
  await (db as any).put(store, value, key);
}

export async function dbDelete<K extends StoreName>(
  store: K,
  key: IDBValidKey
): Promise<void> {
  const db = await getDB();
  await (db as any).delete(store, key);
}
