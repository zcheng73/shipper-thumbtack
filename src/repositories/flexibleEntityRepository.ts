import type { EntityConfig } from "../hooks/useEntity";

export class FlexibleEntityRepository<T extends Record<string, any>> {
  constructor(private config: EntityConfig) {}

  async findAll(): Promise<T[]> {
    // This repository is now deprecated - use useEntity hook instead
    // which calls the backend API
    return [];
  }

  async findById(id: number): Promise<T | null> {
    // Deprecated - use backend API via useEntity
    return null;
  }

  async create(data: Partial<T>): Promise<T> {
    // Deprecated - use backend API via useEntity
    throw new Error("Use useEntity hook instead");
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    // Deprecated - use backend API via useEntity
    throw new Error("Use useEntity hook instead");
  }

  async delete(id: number): Promise<void> {
    // Deprecated - use backend API via useEntity
  }

  async findWhere(conditions: Partial<T>): Promise<T[]> {
    // Deprecated - use backend API via useEntity
    return [];
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