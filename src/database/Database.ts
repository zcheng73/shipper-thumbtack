/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "./client";

export class Database {
  async query(sql: string, params?: any[]): Promise<any[]> {
    try {
      return await db.execute(sql, params || []);
    } catch (error) {
      console.error("[Database] Query error:", error);
      throw error;
    }
  }

  async run(sql: string, params?: any[]): Promise<void> {
    try {
      await db.execute(sql, params || []);
    } catch (error) {
      console.error("[Database] Run error:", error);
      throw error;
    }
  }

  async execute(
    sql: string,
    params?: any[]
  ): Promise<{ lastInsertRowid: bigint | undefined }> {
    try {
      const rows = await db.execute(sql, params || []);
      // PostgreSQL returns the inserted row with RETURNING clause
      const lastId = rows.length > 0 && rows[0].id ? BigInt(rows[0].id) : undefined;
      return { lastInsertRowid: lastId };
    } catch (error) {
      console.error("[Database] Execute error:", error);
      throw error;
    }
  }
}

export const database = new Database();
