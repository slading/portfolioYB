/**
 * ==========================================================================
 * TELEMETRY MODULE (js/telemetry.js)
 * Real-time UTC System Clock & High-Precision Sidebar Metrics Engine
 * Lead Architect: Yauheni Buka
 * ==========================================================================
 */

/**
 * Cryptographically secure random hex string generator for block hashes
 * @param {number} length - Number of hex characters to generate
 * @returns {string} Hexadecimal string
 */
function generateSecureHex(length) {
    const chars = '0123456789ABCDEF';
    let result = '';
    const randomValues = new Uint32Array(length);
    
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(randomValues);
        for (let i = 0; i < length; i++) {
            result += chars[randomValues[i] % 16];
        }
    } else {
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * 16)];
        }
    }
    return result;
}

/**
 * Starts the live UTC clock loop synchronized with requestAnimationFrame
 * Ensures zero UI stutter or frame drop
 * @param {HTMLElement|null} clockElement - DOM element for formatted UTC timestamp
 * @param {HTMLElement|null} epochElement - DOM element for UNIX epoch seconds
 */
export function startClockEngine(clockElement, epochElement) {
    let lastClockSecond = -1;

    function renderClockFrame() {
        const now = new Date();
        const currentSecond = now.getUTCSeconds();

        if (currentSecond !== lastClockSecond) {
            lastClockSecond = currentSecond;
            const year = now.getUTCFullYear();
            const month = String(now.getUTCMonth() + 1).padStart(2, '0');
            const day = String(now.getUTCDate()).padStart(2, '0');
            const hours = String(now.getUTCHours()).padStart(2, '0');
            const mins = String(now.getUTCMinutes()).padStart(2, '0');
            const secs = String(currentSecond).padStart(2, '0');

            const formattedTimestamp = `${year}-${month}-${day} ${hours}:${mins}:${secs} UTC`;
            
            // XSS Safe update using textContent
            if (clockElement) {
                clockElement.textContent = formattedTimestamp;
            }
            if (epochElement) {
                epochElement.textContent = String(Math.floor(now.getTime() / 1000));
            }
        }
        requestAnimationFrame(renderClockFrame);
    }

    requestAnimationFrame(renderClockFrame);
}

/**
 * Initializes sidebar mock telemetry polling engine (updates every 2.0 seconds)
 * @param {Object} metrics - Object mapping metric DOM elements
 */
export function startTelemetryPolling(metrics) {
    function pollSystemMetrics() {
        // Latency strictly calibrated between 12.0ms and 16.0ms
        const latency = (12.1 + Math.random() * 3.8).toFixed(2);
        if (metrics.latencyEl) {
            metrics.latencyEl.textContent = `${latency}ms`;
        }

        // Throughput calibrated around 94.2k req/s
        const throughput = (93.9 + Math.random() * 1.4).toFixed(1);
        if (metrics.throughputEl) {
            metrics.throughputEl.textContent = `${throughput}k req/s`;
        }

        // Rock solid system uptime
        if (metrics.uptimeEl) {
            metrics.uptimeEl.textContent = '99.998%';
        }

        // Short secure block hash signature
        const hashPrefix = generateSecureHex(4);
        const hashSuffix = generateSecureHex(4);
        if (metrics.hashEl) {
            metrics.hashEl.textContent = `0x${hashPrefix}...${hashSuffix}`;
        }
    }

    // Initial immediate run followed by 2000ms periodic updates
    pollSystemMetrics();
    setInterval(pollSystemMetrics, 2000);
}
