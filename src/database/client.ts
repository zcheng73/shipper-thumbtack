import { Pool } from 'pg';

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: import.meta.env.VITE_DATABASE_URL,
  ssl: import.meta.env.VITE_DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Test connection on initialization
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

export class Database {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async execute(sql: string, params: any[] = []): Promise<any[]> {
    try {
      const result = await this.pool.query(sql, params);
      return result.rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Singleton instance
let dbInstance: Database | null = null;

export const getDatabase = (): Database => {
  if (!dbInstance) {
    dbInstance = new Database();
  }
  return dbInstance;
};

export const db = getDatabase();
