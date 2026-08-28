/**
 * @file src/infrastructure/api/mockServer.ts
 * @description Chaos fault injection simulator for offline testing, UI resilience,
 * and reliable 4 UI state verification (Loading, Empty, Error, Data).
 *
 * Invariants:
 * - When enabled, injects configurable artificial latency and simulates deterministic/stochastic errors.
 * - Disabling the simulator immediately reverts to normal simulated latency (100–300ms) with zero forced failures.
 */

import { ApiError, NetworkError, SessionExpiredError, TimeoutError } from './errors';

export type ChaosFaultType = 'none' | 'network' | 'timeout' | 'server_500' | 'session_expired';

export interface ChaosConfig {
  enabled: boolean;
  failureRate: number; // 0.0 to 1.0 probability
  minLatencyMs: number;
  maxLatencyMs: number;
  forcedFaultType: ChaosFaultType;
}

export class ChaosFaultSimulator {
  private config: ChaosConfig = {
    enabled: false,
    failureRate: 0.2, // 20% by default when enabled
    minLatencyMs: 200,
    maxLatencyMs: 600,
    forcedFaultType: 'none',
  };

  /**
   * Configures simulator parameters.
   */
  configure(config: Partial<ChaosConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Returns current chaos configuration.
   */
  getConfig(): Readonly<ChaosConfig> {
    return Object.freeze({ ...this.config });
  }

  /**
   * Simulates network latency and conditionally injects an error based on active chaos settings.
   */
  async simulateNetworkHop(): Promise<void> {
    const { enabled, minLatencyMs, maxLatencyMs, failureRate, forcedFaultType } = this.config;

    // 1. Calculate simulated latency
    const latency = enabled
      ? Math.floor(Math.random() * (maxLatencyMs - minLatencyMs + 1)) + minLatencyMs
      : Math.floor(Math.random() * 150) + 100; // Normal fast local mock (100-250ms)

    await new Promise<void>((resolve) => setTimeout(() => resolve(), latency));

    // 2. If disabled or forced to none with 0 rate, return normally
    if (!enabled) return;

    // 3. Check for forced fault or stochastic failure
    const shouldFail = forcedFaultType !== 'none' || Math.random() < failureRate;
    if (!shouldFail) return;

    const faultType = forcedFaultType !== 'none' ? forcedFaultType : this.pickRandomFault();
    this.throwFault(faultType);
  }

  private pickRandomFault(): ChaosFaultType {
    const faults: ChaosFaultType[] = ['network', 'timeout', 'server_500', 'session_expired'];
    return faults[Math.floor(Math.random() * faults.length)];
  }

  private throwFault(type: ChaosFaultType): never {
    switch (type) {
      case 'network':
        throw new NetworkError('[CHAOS SIMULATOR] Simulated network connection drop.');
      case 'timeout':
        throw new TimeoutError('[CHAOS SIMULATOR] Simulated gateway timeout after latency.');
      case 'session_expired':
        throw new SessionExpiredError('[CHAOS SIMULATOR] Simulated 401 session token expiry.');
      case 'server_500':
      default:
        throw new ApiError(500, '[CHAOS SIMULATOR] Internal Server Error 500 occurred.');
    }
  }
}

export const chaosSimulator = new ChaosFaultSimulator();
