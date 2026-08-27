# Approach 04: Network Resilience & Chaos Fault Injection

## 1. Custom HTTP Client Architecture
- Wraps `fetch` with configurable `AbortController` timeout (default 10s).
- Exponential backoff retry (max 3 attempts) for idempotent GET requests.
- Maps raw HTTP codes to a typed error taxonomy (`NetworkError`, `TimeoutError`, `ApiError`, `SessionExpiredError`, `ParseError`).

## 2. Chaos Mock Server Layer
To verify reliability requirements under real-world conditions, the mock server supports configurable fault injection modes:
- **Latency Delay:** Simulated 2G/3G slow network (500ms – 3000ms).
- **Random Failures:** Configurable failure rate (e.g. 20% random HTTP 500/503 errors).
- **Corrupt / Partial JSON:** Simulates broken network packets.
- **Session Expiration:** Injects 401 Unauthorized responses to test global re-auth triggers.

## 3. Four Explicit UI States on Every Screen
No screen fails silently. Every data-fetching screen renders:
1. **Loading State:** Shimmering skeleton placeholders matching layout.
2. **Empty State:** Illustrated empty view with actionable CTA.
3. **Error State:** Human-readable error message with explicit "Retry" button.
4. **Data State:** Fully rendered interactive list/content.
