// Generic CRUD data access layer over Supabase.
// Provides reusable helpers (getAll, getById, createRecord, updateRecord, deleteRecord)
// for any registered table — used by the Admin panel and feature services alike.
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type TableName = keyof Database["public"]["Tables"];

export type QueryOptions = {
  filters?: Record<string, string | number | boolean | null>;
  search?: { column: string; value: string };
  orderBy?: { column: string; ascending?: boolean };
  page?: number;
  pageSize?: number;
};

function log(scope: string, payload: unknown) {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.debug(`[db:${scope}]`, payload);
  }
}

export async function getAll<T = Record<string, unknown>>(
  table: string,
  options: QueryOptions = {},
): Promise<{ rows: T[]; count: number }> {
  const { filters, search, orderBy, page = 1, pageSize = 25 } = options;
  let q = supabase
    .from(table as TableName)
    .select("*", { count: "exact" });

  if (filters) {
    for (const [k, v] of Object.entries(filters)) {
      if (v === null) q = q.is(k, null);
      else q = q.eq(k, v as never);
    }
  }
  if (search?.value) q = q.ilike(search.column, `%${search.value}%`);
  if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? false });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) {
    log("getAll:error", { table, error });
    throw error;
  }
  return { rows: (data ?? []) as T[], count: count ?? 0 };
}

export async function getById<T = Record<string, unknown>>(
  table: string,
  id: string,
): Promise<T | null> {
  const { data, error } = await supabase
    .from(table as TableName)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    log("getById:error", { table, id, error });
    throw error;
  }
  return (data ?? null) as T | null;
}

export async function createRecord<T = Record<string, unknown>>(
  table: string,
  values: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await supabase
    .from(table as TableName)
    .insert(values as never)
    .select()
    .single();
  if (error) {
    log("create:error", { table, error });
    throw error;
  }
  return data as T;
}

export async function updateRecord<T = Record<string, unknown>>(
  table: string,
  id: string,
  values: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await supabase
    .from(table as TableName)
    .update(values as never)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    log("update:error", { table, id, error });
    throw error;
  }
  return data as T;
}

export async function deleteRecord(table: string, id: string): Promise<void> {
  const { error } = await supabase
    .from(table as TableName)
    .delete()
    .eq("id", id);
  if (error) {
    log("delete:error", { table, id, error });
    throw error;
  }
}
