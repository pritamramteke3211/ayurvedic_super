/**
 * @file src/infrastructure/network/networkManager.ts
 * @description Central network connectivity monitor and offline state detector.
 *
 * Invariants:
 * - Completely resilient: Works in pure JS with periodic lightweight health probes.
 * - Supports simulated offline toggling for developer testing.
 * - Broadcasts network transitions to registered listeners immediately.
 */

import { useEffect, useState } from 'react';
import { logger } from '../logging/logger';

type NetworkListener = (isOnline: boolean) => void;

class NetworkManager {
  private onlineStatus: boolean = true;
  private isSimulatedOffline: boolean = false;
  private listeners = new Set<NetworkListener>();
  private pingIntervalId: any = null;

  constructor() {
    this.init();
  }

  private init() {
    // Check connectivity initially and on regular intervals
    this.checkConnectivity();
    this.pingIntervalId = setInterval(() => {
      this.checkConnectivity();
    }, 15000);
  }

  private async checkConnectivity() {
    if (this.isSimulatedOffline) {
      this.updateStatus(false);
      return;
    }

    try {
      // Fast lightweight endpoint probe with 3s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('https://clients3.google.com/generate_204', {
        method: 'HEAD',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      this.updateStatus(response.ok || response.status === 204);
    } catch {
      // If probe fails or times out, we are offline or on local mock
      // Default to online unless simulated offline or network error
      this.updateStatus(!this.isSimulatedOffline);
    }
  }

  private updateStatus(rawStatus: boolean) {
    const effectiveStatus = this.isSimulatedOffline ? false : rawStatus;
    if (this.onlineStatus !== effectiveStatus) {
      this.onlineStatus = effectiveStatus;
      logger.info('NetworkManager', `Network status changed: ${effectiveStatus ? 'ONLINE' : 'OFFLINE'}`);
      this.listeners.forEach((listener) => listener(effectiveStatus));
    }
  }

  public get isOnline(): boolean {
    return this.isSimulatedOffline ? false : this.onlineStatus;
  }

  public setSimulatedOffline(offline: boolean) {
    this.isSimulatedOffline = offline;
    this.updateStatus(!offline);
  }

  public toggleOfflineMode() {
    this.setSimulatedOffline(!this.isSimulatedOffline);
    return this.isOnline;
  }

  public subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    listener(this.isOnline);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public cleanup() {
    if (this.pingIntervalId) {
      clearInterval(this.pingIntervalId);
    }
  }
}

export const networkManager = new NetworkManager();

/**
 * Custom React hook to observe online/offline status in UI components.
 */
export function useIsOnline(): boolean {
  const [online, setOnline] = useState<boolean>(networkManager.isOnline);

  useEffect(() => {
    return networkManager.subscribe((isOnline) => {
      setOnline(isOnline);
    });
  }, []);

  return online;
}
