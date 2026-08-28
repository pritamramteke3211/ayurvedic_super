import { storage } from './mmkv';
import { logger } from '../logging/logger';

export type SyncActionType =
  | 'CREATE_BOOKING'
  | 'CANCEL_BOOKING'
  | 'SYNC_CART'
  | 'CREATE_HEALTH_RECORD'
  | 'DELETE_HEALTH_RECORD';

export interface SyncAction<T = unknown> {
  id: string;
  type: SyncActionType;
  payload: T;
  createdAt: string;
  retryCount: number;
}

const SYNC_QUEUE_KEY = '@ayurvedic_sync_queue';

export class SyncQueue {
  private queue: SyncAction[] = [];

  constructor() {
    this.loadQueue();
  }

  private loadQueue(): void {
    const saved = storage.getObject<SyncAction[]>(SYNC_QUEUE_KEY);
    if (saved && Array.isArray(saved)) {
      this.queue = saved;
    }
  }

  private persistQueue(): void {
    storage.setObject(SYNC_QUEUE_KEY, this.queue);
  }

  enqueue<T>(type: SyncActionType, payload: T): SyncAction<T> {
    const action: SyncAction<T> = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };

    this.queue.push(action as SyncAction);
    this.persistQueue();
    logger.info('SyncQueue', `Enqueued action: ${action.type} (${action.id})`);
    return action;
  }

  getPendingActions(): SyncAction[] {
    return [...this.queue];
  }

  removeAction(actionId: string): void {
    this.queue = this.queue.filter(a => a.id !== actionId);
    this.persistQueue();
    logger.info('SyncQueue', `Removed synced action: ${actionId}`);
  }

  clear(): void {
    this.queue = [];
    this.persistQueue();
  }
}

export const syncQueue = new SyncQueue();
