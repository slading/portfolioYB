/**
 * ==========================================================================
 * APPLICATION ENTRY POINT (js/app.js)
 * Architecture Coordinator, Routing/State Management & XSS Protection Layer
 * Lead Architect: Yauheni Buka
 * ==========================================================================
 */

import { startClockEngine, startTelemetryPolling } from './telemetry.js';
import { renderMeasuringRulers, initCoordinateTracking, initCanvasPanZoom, updateOrthogonalConnectors } from './blueprint.js';

document.addEventListener('DOMContentLoaded', () => {
    // Collect DOM Elements safely
    const domCache = {
        headerClock: document.getElementById('header-utc-clock'),
        epochTime: document.getElementById('epoch-time'),
        rulerX: document.getElementById('ruler-x'),
        rulerY: document.getElementById('ruler-y'),
        markerX: document.getElementById('cursor-marker-x'),
        markerY: document.getElementById('cursor-marker-y'),
        labelX: document.getElementById('coord-label-x'),
        labelY: document.getElementById('coord-label-y'),
        sidebarX: document.getElementById('telemetry-x'),
        sidebarY: document.getElementById('telemetry-y'),
        canvasContainer: document.getElementById('blueprint-canvas'),
        canvasContent: document.getElementById('canvas-content'),
        telemetryScale: document.getElementById('telemetry-scale'),
        telemetryPan: document.getElementById('telemetry-pan'),
        stampCoord: document.getElementById('stamp-coord'),
        metricLatency: document.getElementById('metric-latency'),
        metricThroughput: document.getElementById('metric-throughput'),
        metricUptime: document.getElementById('metric-uptime'),
        metricHash: document.getElementById('metric-hash'),
        btnExportPdf: document.getElementById('btn-export-pdf'),
        btnZoomIn: document.getElementById('btn-zoom-in'),
        btnZoomOut: document.getElementById('btn-zoom-out'),
        btnResetView: document.getElementById('btn-reset-view')
    };

    // 1. Initialize Real-Time Telemetry & Clock Engines
    startClockEngine(domCache.headerClock, domCache.epochTime);
    startTelemetryPolling({
        latencyEl: domCache.metricLatency,
        throughputEl: domCache.metricThroughput,
        uptimeEl: domCache.metricUptime,
        hashEl: domCache.metricHash
    });

    // 2. Initialize Precision Rulers & Coordinate Tracking
    renderMeasuringRulers(domCache.rulerX, domCache.rulerY);
    initCoordinateTracking({
        canvasX: domCache.rulerX,
        canvasY: domCache.rulerY,
        markerX: domCache.markerX,
        markerY: domCache.markerY,
        labelX: domCache.labelX,
        labelY: domCache.labelY,
        sidebarX: domCache.sidebarX,
        sidebarY: domCache.sidebarY
    });

    // 3. Initialize Interactive Canvas Pan/Zoom Engine
    initCanvasPanZoom({
        canvasContainer: domCache.canvasContainer,
        canvasContent: domCache.canvasContent,
        scaleEl: domCache.telemetryScale,
        panEl: domCache.telemetryPan,
        stampEl: domCache.stampCoord,
        btnZoomIn: domCache.btnZoomIn,
        btnZoomOut: domCache.btnZoomOut,
        btnResetView: domCache.btnResetView
    });

    // 4. Initialize Enterprise PDF Export Handler
    if (domCache.btnExportPdf) {
        domCache.btnExportPdf.addEventListener('click', () => {
            window.print();
        });
    }

    // 5. Handle Responsive Window Resize
    window.addEventListener('resize', () => {
        renderMeasuringRulers(domCache.rulerX, domCache.rulerY);
        updateOrthogonalConnectors();
    });

    // Final connector sync after DOM layout settles
    setTimeout(updateOrthogonalConnectors, 150);
});
