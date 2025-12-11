import { db } from "../database/client";
import type { EntityConfig } from "../hooks/useEntity";

export class FlexibleEntityRepository<T extends Record<string, any>> {
  constructor(private config: EntityConfig) {}

  async findAll(): Promise<T[]> {
    const entityType = this.config.entityType || this.config.name;
    let sql = `SELECT id, entity_type, data, created_at, updated_at FROM entities WHERE entity_type = $1`;

    if (this.config.orderBy) {
      sql += ` ORDER BY ${this.config.orderBy}`;
    }

    try {
      const rows = await db.execute(sql, [entityType]);
      return rows.map((row) => this.rowToEntity(row));
    } catch (error) {
      console.error("Error finding all entities:", error);
      throw error;
    }
  }

  async findById(id: number): Promise<T | null> {
    const entityType = this.config.entityType || this.config.name;
    const sql = `SELECT id, entity_type, data, created_at, updated_at FROM entities WHERE entity_type = $1 AND id = $2`;

    try {
      const rows = await db.execute(sql, [entityType, id]);
      if (rows.length === 0) return null;
      return this.rowToEntity(rows[0]);
    } catch (error) {
      console.error("Error finding entity by id:", error);
      throw error;
    }
  }

  async create(data: Partial<T>): Promise<T> {
    const entityType = this.config.entityType || this.config.name;
    
    // Apply defaults
    const entityData: any = { ...data };
    if (this.config.properties) {
      for (const [key, prop] of Object.entries(this.config.properties)) {
        if (prop.default !== undefined && entityData[key] === undefined) {
          entityData[key] = prop.default;
        }
      }
    }

    const sql = `INSERT INTO entities (entity_type, data, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id, entity_type, data, created_at, updated_at`;

    try {
      const rows = await db.execute(sql, [entityType, JSON.stringify(entityData)]);
      return this.rowToEntity(rows[0]);
    } catch (error) {
      console.error("Error creating entity:", error);
      throw error;
    }
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    const entityType = this.config.entityType || this.config.name;
    
    // Get existing entity
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Entity with id ${id} not found`);
    }

    // Merge data
    const { id: _, created_at, updated_at, ...existingData } = existing as any;
    const updatedData = { ...existingData, ...(data as any) };

    const sql = `UPDATE entities SET data = $1, updated_at = NOW() WHERE entity_type = $2 AND id = $3 RETURNING id, entity_type, data, created_at, updated_at`;

    try {
      const rows = await db.execute(sql, [JSON.stringify(updatedData), entityType, id]);
      return this.rowToEntity(rows[0]);
    } catch (error) {
      console.error("Error updating entity:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const entityType = this.config.entityType || this.config.name;
    const sql = `DELETE FROM entities WHERE entity_type = $1 AND id = $2`;

    try {
      await db.execute(sql, [entityType, id]);
    } catch (error) {
      console.error("Error deleting entity:", error);
      throw error;
    }
  }

  async findWhere(conditions: Partial<T>): Promise<T[]> {
    const entityType = this.config.entityType || this.config.name;
    let sql = `SELECT id, entity_type, data, created_at, updated_at FROM entities WHERE entity_type = $1`;
    const params: any[] = [entityType];
    
    // Add JSON conditions for each field
    let paramIndex = 2;
    for (const [key, value] of Object.entries(conditions)) {
      sql += ` AND data->>'${key}' = $${paramIndex}`;
      params.push(String(value));
      paramIndex++;
    }

    if (this.config.orderBy) {
      sql += ` ORDER BY ${this.config.orderBy}`;
    }

    try {
      const rows = await db.execute(sql, params);
      return rows.map((row) => this.rowToEntity(row));
    } catch (error) {
      console.error("Error finding entities with conditions:", error);
      throw error;
    }
  }

  private rowToEntity(row: any): T {
    const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    return {
      id: row.id,
      ...data,
      created_at: row.created_at,
      updated_at: row.updated_at,
    } as T;
  }
}

export function createFlexibleEntityRepository<T extends Record<string, any>>(config: EntityConfig): FlexibleEntityRepository<T> {
  return new FlexibleEntityRepository<T>(config);
}
