import { useCallback, useEffect, useMemo, useState } from "react";
import { FlexibleEntityRepository } from "../repositories/flexibleEntityRepository";

export type EntityField = {
  type: "string" | "number" | "integer";
  format?: "date" | string;
  description?: string;
  enum?: string[];
  default?: unknown;
};

export type EntityConfig = {
  name: string;
  entityType?: string;
  orderBy?: string;
  properties: Record<string, EntityField>;
  required?: string[];
};

export type EntityRecord = {
  id: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
};

export const useEntity = <T extends EntityRecord>(config: EntityConfig) => {
  const repo = useMemo(
    () => new FlexibleEntityRepository<T>(config),
    [config]
  );

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await repo.findAll();
      setItems(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [repo]);

  const create = useCallback(
    async (data: Omit<T, "id" | "created_at" | "updated_at">) => {
      await repo.create(data as Partial<T>);
      await reload();
    },
    [repo, reload]
  );

  const update = useCallback(
    async (id: string | number, data: Partial<T>) => {
      await repo.update(Number(id), data);
      await reload();
    },
    [repo, reload]
  );

  const remove = useCallback(
    async (id: string | number) => {
      await repo.delete(Number(id));
      await reload();
    },
    [repo, reload]
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, loading, error, reload, create, update, remove, config };
};
