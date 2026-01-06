export interface PendingStore {
  put(id: string, body: unknown): Promise<void>;
  has(id: string): Promise<boolean>;
  list(limit: number): Promise<Array<{id: string; received_at: string}>>;
  get(id: string): Promise<unknown | null>;
}

export class MemoryPendingStore implements PendingStore {
  private items: Map<string, {body: unknown; received_at: string}> = new Map();

  async put(id: string, body: unknown): Promise<void> {
    this.items.set(id, { body, received_at: new Date().toISOString() });
  }
  async has(id: string): Promise<boolean> {
    return this.items.has(id);
  }
  async list(limit: number) {
    return Array.from(this.items.entries())
      .slice(0, limit)
      .map(([id, v]) => ({ id, received_at: v.received_at }));
  }
  async get(id: string) {
    return this.items.get(id)?.body ?? null;
  }
}
