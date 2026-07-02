/**
 * ==========================================================================
 * BLUEPRINT MATH & INTERACTIVITY MODULE (js/blueprint.js)
 * Coordinate Axes Tracking, Canvas Pan/Zoom Engine, & Orthogonal Vector Routing
 * Automation & AI Analyst: Yauheni Buka
 * ==========================================================================
 */

/**
 * Renders precision pixelated measuring rulers onto top X and left Y canvases
 * @param {HTMLCanvasElement|null} canvasX - Top X ruler canvas
 * @param {HTMLCanvasElement|null} canvasY - Left Y ruler canvas
 */
export function renderMeasuringRulers(canvasX, canvasY) {
    if (!canvasX || !canvasY) return;

    const dpr = window.devicePixelRatio || 1;
    const rectX = canvasX.getBoundingClientRect();
    const rectY = canvasY.getBoundingClientRect();

    canvasX.width = rectX.width * dpr;
    canvasX.height = rectX.height * dpr;
    const ctxX = canvasX.getContext('2d');
    ctxX.scale(dpr, dpr);

    canvasY.width = rectY.width * dpr;
    canvasY.height = rectY.height * dpr;
    const ctxY = canvasY.getContext('2d');
    ctxY.scale(dpr, dpr);

    // Render X Ruler
    ctxX.clearRect(0, 0, rectX.width, rectX.height);
    ctxX.strokeStyle = 'rgba(139, 155, 180, 0.4)';
    ctxX.fillStyle = '#8b9bb4';
    ctxX.font = '9px "JetBrains Mono"';
    ctxX.lineWidth = 1;

    for (let x = 0; x < rectX.width; x += 10) {
        ctxX.beginPath();
        if (x % 100 === 0) {
            ctxX.moveTo(x + 0.5, rectX.height - 14);
            ctxX.lineTo(x + 0.5, rectX.height);
            ctxX.fillText(String(x).padStart(4, '0'), x + 4, rectX.height - 10);
        } else if (x % 50 === 0) {
            ctxX.moveTo(x + 0.5, rectX.height - 8);
            ctxX.lineTo(x + 0.5, rectX.height);
        } else {
            ctxX.moveTo(x + 0.5, rectX.height - 4);
            ctxX.lineTo(x + 0.5, rectX.height);
        }
        ctxX.stroke();
    }

    // Render Y Ruler
    ctxY.clearRect(0, 0, rectY.width, rectY.height);
    ctxY.strokeStyle = 'rgba(139, 155, 180, 0.4)';
    ctxY.fillStyle = '#8b9bb4';
    ctxY.font = '8px "JetBrains Mono"';
    ctxY.lineWidth = 1;

    for (let y = 0; y < rectY.height; y += 10) {
        ctxY.beginPath();
        if (y % 100 === 0) {
            ctxY.moveTo(rectY.width - 14, y + 0.5);
            ctxY.lineTo(rectY.width, y + 0.5);
            ctxY.save();
            ctxY.translate(4, y + 24);
            ctxY.rotate(-Math.PI / 2);
            ctxY.fillText(String(y).padStart(4, '0'), 0, 8);
            ctxY.restore();
        } else if (y % 50 === 0) {
            ctxY.moveTo(rectY.width - 8, y + 0.5);
            ctxY.lineTo(rectY.width, y + 0.5);
        } else {
            ctxY.moveTo(rectY.width - 4, y + 0.5);
            ctxY.lineTo(rectY.width, y + 0.5);
        }
        ctxY.stroke();
    }
}

/**
 * Initializes real-time mouse coordinate tracking across viewport rulers and telemetry UI
 * @param {Object} ui - Object holding DOM references for ruler markers and labels
 */
export function initCoordinateTracking(ui) {
    document.addEventListener('mousemove', (e) => {
        const clientX = e.clientX;
        const clientY = e.clientY;

        if (ui.markerX && ui.labelX && ui.canvasX) {
            const rectX = ui.canvasX.getBoundingClientRect();
            const relX = clientX - rectX.left;
            if (relX >= 0 && relX <= rectX.width) {
                ui.markerX.style.display = 'block';
                ui.markerX.style.left = `${relX}px`;
                ui.labelX.textContent = `X: ${String(Math.round(relX)).padStart(4, '0')} PX`;
            }
        }

        if (ui.markerY && ui.labelY && ui.canvasY) {
            const rectY = ui.canvasY.getBoundingClientRect();
            const relY = clientY - rectY.top;
            if (relY >= 0 && relY <= rectY.height) {
                ui.markerY.style.display = 'block';
                ui.markerY.style.top = `${relY}px`;
                ui.labelY.textContent = `${String(Math.round(relY)).padStart(4, '0')} PX`;
            }
        }

        if (ui.sidebarX) ui.sidebarX.textContent = `${clientX.toFixed(1)} PX`;
        if (ui.sidebarY) ui.sidebarY.textContent = `${clientY.toFixed(1)} PX`;
    }, { passive: true });
}

/**
 * Calculates exact orthogonal 3-segment engineering paths connecting root node to child nodes
 */
export function updateOrthogonalConnectors() {
    const canvasEl = document.getElementById('blueprint-canvas');
    const centerNode = document.getElementById('node-center');
    const sentinelNode = document.getElementById('node-sentinel');
    const repolensNode = document.getElementById('node-repolens');

    if (!canvasEl || !centerNode || !sentinelNode || !repolensNode) return;

    const canvasRect = canvasEl.getBoundingClientRect();
    const centerRect = centerNode.getBoundingClientRect();
    const sentinelRect = sentinelNode.getBoundingClientRect();
    const repolensRect = repolensNode.getBoundingClientRect();

    const cLeftX = centerRect.left - canvasRect.left;
    const cRightX = centerRect.right - canvasRect.left;
    const cY = (centerRect.top + centerRect.bottom) / 2 - canvasRect.top;

    const sX = sentinelRect.right - canvasRect.left;
    const sY = (sentinelRect.top + sentinelRect.bottom) / 2 - canvasRect.top;

    const rX = repolensRect.left - canvasRect.left;
    const rY = (repolensRect.top + repolensRect.bottom) / 2 - canvasRect.top;

    const setCircle = (id, x, y) => {
        const el = document.getElementById(id);
        if (el) { el.setAttribute('cx', String(x)); el.setAttribute('cy', String(y)); }
    };
    setCircle('joint-center', (cLeftX + cRightX) / 2, cY);
    setCircle('joint-sentinel', sX, sY);
    setCircle('joint-repolens', rX, rY);

    const midSX = (cLeftX + sX) / 2;
    const pathSentinel = `M ${sX} ${sY} L ${midSX} ${sY} L ${midSX} ${cY} L ${cLeftX} ${cY}`;

    const midRX = (cRightX + rX) / 2;
    const pathRepolens = `M ${cRightX} ${cY} L ${midRX} ${cY} L ${midRX} ${rY} L ${rX} ${rY}`;

    const setPath = (id, d) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute('d', d);
    };

    setPath('line-sentinel-base', pathSentinel);
    setPath('line-sentinel-anim', pathSentinel);
    setPath('line-repolens-base', pathRepolens);
    setPath('line-repolens-anim', pathRepolens);
}

/**
 * Initializes interactive drag-panning and mouse-wheel scaling of the blueprint canvas
 * @param {Object} config - Object holding canvas references and zoom control buttons
 */
export function initCanvasPanZoom(config) {
    let scale = 0.85;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    function applyCanvasTransform() {
        if (config.canvasContent) {
            config.canvasContent.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        }
        if (config.scaleEl) {
            config.scaleEl.textContent = `${scale.toFixed(3)}x [${Math.round(scale * 100)}%]`;
        }
        if (config.panEl) {
            config.panEl.textContent = `[${Math.round(panX)}, ${Math.round(panY)}]`;
        }
        if (config.stampEl) {
            config.stampEl.textContent = `POS [${Math.round(panX)}, ${Math.round(panY)}] // ZOOM ${Math.round(scale * 100)}%`;
        }
        updateOrthogonalConnectors();
    }

    if (config.canvasContainer) {
        config.canvasContainer.addEventListener('mousedown', (e) => {
            if (e.target.closest('button') || e.target.closest('a')) return;
            isDragging = true;
            startX = e.clientX - panX;
            startY = e.clientY - panY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panX = e.clientX - startX;
            panY = e.clientY - startY;
            applyCanvasTransform();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        config.canvasContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSensitivity = 0.08;
            const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
            scale = Math.min(Math.max(0.3, scale + delta), 2.5);
            applyCanvasTransform();
        }, { passive: false });
    }

    if (config.btnZoomIn) {
        config.btnZoomIn.addEventListener('click', () => {
            scale = Math.min(2.5, scale + 0.15);
            applyCanvasTransform();
        });
    }
    if (config.btnZoomOut) {
        config.btnZoomOut.addEventListener('click', () => {
            scale = Math.max(0.3, scale - 0.15);
            applyCanvasTransform();
        });
    }
    if (config.btnResetView) {
        config.btnResetView.addEventListener('click', () => {
            scale = 0.85;
            panX = 0;
            panY = 0;
            applyCanvasTransform();
        });
    }

    // Initial positioning
    applyCanvasTransform();
}
