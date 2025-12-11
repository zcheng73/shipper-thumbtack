import { useState, useEffect } from 'react';
import * as api from '../database/api';

export interface EntityConfig {
  name: string;
  orderBy?: string;
  properties: Record<string, any>;
  required?: string[];
}

export function useEntity<T extends { id: number }>(config: EntityConfig) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const reload = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getEntities(config.name);
      setItems(data);
    } catch (err) {
      setError(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, [config.name]);

  const create = async (data: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const result = await api.createEntity(config.name, data);
      setItems([result as T, ...items]);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const update = async (id: number, data: Partial<T>) => {
    try {
      const result = await api.updateEntity(id, data);
      setItems(items.map(item => (item.id === id ? (result as T) : item)));
      return result;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const remove = async (id: number) => {
    try {
      await api.deleteEntity(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return { items, loading, error, reload, create, update, remove, config };
}