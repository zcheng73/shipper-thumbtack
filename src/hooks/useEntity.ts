import { useState, useEffect } from 'react';
import { FlexibleEntityRepository } from '../repositories/flexibleEntityRepository';

export interface EntityConfig {
  name: string;
  entityType?: string;
  orderBy?: string;
  properties: {
    [key: string]: {
      type: string;
      description?: string;
      enum?: string[];
      default?: any;
      format?: string;
    };
  };
  required?: string[];
}

export function useEntity<T extends { id: number }>(config: EntityConfig) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const repository = new FlexibleEntityRepository(config);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await repository.findAll();
      setItems(data as T[]);
    } catch (err) {
      console.error(`Error loading ${config.name}:`, err);
      setError(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const create = async (data: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newItem = await repository.create(data);
      setItems(prev => [...prev, newItem as T]);
      return newItem as T;
    } catch (err) {
      console.error(`Error creating ${config.name}:`, err);
      setError(err);
      throw err;
    }
  };

  const update = async (id: number, data: Partial<T>) => {
    try {
      const updated = await repository.update(id, data);
      setItems(prev => prev.map(item => item.id === id ? updated as T : item));
      return updated as T;
    } catch (err) {
      console.error(`Error updating ${config.name}:`, err);
      setError(err);
      throw err;
    }
  };

  const remove = async (id: number) => {
    try {
      await repository.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(`Error deleting ${config.name}:`, err);
      setError(err);
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    create,
    update,
    remove,
    reload: loadItems,
    config,
  };
}
