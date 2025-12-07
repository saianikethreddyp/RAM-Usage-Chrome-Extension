(function () {
    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.id = 'ram-usage-overlay';

    // Header Section (Draggable)
    const header = document.createElement('div');
    header.className = 'ram-header';
    header.innerHTML = `
        <div class="ram-icon">⚡</div>
        <div class="ram-content">
            <div class="ram-label">Memory & FPS</div>
            <div class="ram-value">
                <span class="ram-indicator"></span>
                <span id="ram-text">...</span>
                <span style="font-size: 10px; opacity: 0.3; margin: 0 4px;">|</span>
                <span id="fps-text" style="font-size: 12px; color: var(--text-secondary);">-- FPS</span>
            </div>
        </div>
        <div class="ram-permissions" id="ram-perms"></div>
    `;

    // Graph Section
    const graphContainer = document.createElement('div');
    graphContainer.className = 'ram-graph-container';
    graphContainer.innerHTML = '<canvas id="ram-graph"></canvas>';

    // Stats Row
    const statsRow = document.createElement('div');
    statsRow.className = 'ram-stats-row';
    statsRow.innerHTML = `
        <div class="stat-item">DOM: <b id="dom-count">--</b></div>
        <div class="stat-item">Peak: <b id="mem-peak">--</b> MB</div>
    `;

    overlay.appendChild(header);
    overlay.appendChild(graphContainer);
    overlay.appendChild(statsRow);
    document.body.appendChild(overlay);

    // Elements
    const ramText = overlay.querySelector('#ram-text');
    const fpsText = overlay.querySelector('#fps-text');
    const domText = overlay.querySelector('#dom-count');
    const peakText = overlay.querySelector('#mem-peak');
    const permsContainer = overlay.querySelector('#ram-perms');
    const canvas = overlay.querySelector('#ram-graph');

    // State
    let isExpanded = false;
    let memoryHistory = [];
    const maxHistory = 50; // Points on graph
    let peakMemory = 0;

    // FPS State
    let lastTime = performance.now();
    let frameCount = 0;

    // Draggable Logic
    let isDragging = false;
    let dragStartTime = 0;

    header.onmousedown = function (e) {
        e.preventDefault();
        isDragging = false;
        dragStartTime = Date.now();

        let pos3 = e.clientX;
        let pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        function elementDrag(e) {
            e.preventDefault();
            // Calculate new position
            let pos1 = pos3 - e.clientX;
            let pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // Set new position
            overlay.style.top = (overlay.offsetTop - pos2) + "px";
            overlay.style.left = (overlay.offsetLeft - pos1) + "px";
            // Remove fixed bottom/right if we move it
            overlay.style.bottom = 'auto';
            overlay.style.right = 'auto';

            isDragging = true;
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    };

    // Toggle Expand (only if not dragged)
    header.onclick = function () {
        if (!isDragging && (Date.now() - dragStartTime < 200)) {
            isExpanded = !isExpanded;
            graphContainer.classList.toggle('visible', isExpanded);
            statsRow.classList.toggle('visible', isExpanded);

            // Resize canvas when opened
            if (isExpanded) {
                canvas.width = graphContainer.offsetWidth;
                canvas.height = graphContainer.offsetHeight;
                drawGraph();
            }
        }
    };

    // --- Core Logic ---

    // Permissions
    const permissionsToCheck = [
        { name: 'camera', icon: '📷', label: 'Camera' },
        { name: 'microphone', icon: '🎤', label: 'Microphone' },
        { name: 'geolocation', icon: '📍', label: 'Location' }
    ];

    async function checkPermissions() {
        permsContainer.innerHTML = '';
        let hasActive = false;
        for (const perm of permissionsToCheck) {
            try {
                const result = await navigator.permissions.query({ name: perm.name });
                if (result.state === 'granted') {
                    const iconEl = document.createElement('span');
                    iconEl.className = 'perm-icon active';
                    iconEl.textContent = perm.icon;
                    iconEl.setAttribute('data-tooltip', perm.label);
                    permsContainer.appendChild(iconEl);
                    hasActive = true;
                }
            } catch (e) { }
        }
        permsContainer.style.display = hasActive ? 'flex' : 'none';
    }

    function updateTheme(usedMB) {
        let colorVar = '0, 255, 127'; // Green
        if (usedMB > 1000) colorVar = '255, 68, 68'; // Red
        else if (usedMB > 500) colorVar = '255, 187, 51'; // Orange
        overlay.style.setProperty('--indicator-color', colorVar);
    }

    function drawGraph() {
        if (!canvas.getContext || !isExpanded) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        if (memoryHistory.length < 2) return;

        ctx.beginPath();
        const maxVal = Math.max(...memoryHistory, 100) * 1.1; // Scale based on max
        const minVal = Math.min(...memoryHistory) * 0.9;
        const range = maxVal - minVal;

        const stepX = width / (maxHistory - 1);

        memoryHistory.forEach((val, i) => {
            const x = i * stepX;
            const y = height - ((val - minVal) / range) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        // Gradient Stroke
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgba(0, 255, 127, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 255, 127, 1)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.stroke();
    }

    function updateStats() {
        // 1. Memory
        if (performance && performance.memory) {
            const usedMB = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
            ramText.textContent = `${usedMB} MB`;
            updateTheme(parseFloat(usedMB));

            // Track history
            memoryHistory.push(parseFloat(usedMB));
            if (memoryHistory.length > maxHistory) memoryHistory.shift();

            // Peak
            if (parseFloat(usedMB) > peakMemory) peakMemory = parseFloat(usedMB);
            peakText.textContent = peakMemory.toFixed(0);

            if (isExpanded) drawGraph();
        } else {
            ramText.textContent = 'N/A';
        }

        // 2. FPS
        const now = performance.now();
        frameCount++;
        if (now - lastTime >= 1000) {
            fpsText.textContent = `${frameCount} FPS`;
            frameCount = 0;
            lastTime = now;
        }

        // 3. DOM Nodes (Expensive, do less often? 1s is fine for simple check)
        domText.textContent = document.getElementsByTagName('*').length;
    }

    // Init
    checkPermissions();
    setInterval(checkPermissions, 5000);
    setInterval(updateStats, 1000); // Update every second

    console.log('RAM Usage Monitor Pro active.');
})();
