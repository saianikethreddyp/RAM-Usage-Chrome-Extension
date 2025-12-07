(function () {
    // Create the overlay element with new structure
    const overlay = document.createElement('div');
    overlay.id = 'ram-usage-overlay';

    // Create inner HTML structure
    overlay.innerHTML = `
    <div class="ram-icon">⚡</div>
    <div class="ram-content">
      <div class="ram-label">JS Heap</div>
      <div class="ram-value">
        <span class="ram-indicator"></span>
        <span id="ram-text">...</span>
      </div>
    </div>
    <div class="ram-permissions" id="ram-perms">
      <!-- Icons injected here -->
    </div>
  `;

    document.body.appendChild(overlay);

    const ramText = overlay.querySelector('#ram-text');
    const permsContainer = overlay.querySelector('#ram-perms');

    // Permissions to check
    const permissionsToCheck = [
        { name: 'camera', icon: '📷', label: 'Camera' },
        { name: 'microphone', icon: '🎤', label: 'Microphone' },
        { name: 'geolocation', icon: '📍', label: 'Location' },
        { name: 'notifications', icon: '🔔', label: 'Notifications' }
    ];

    async function checkPermissions() {
        permsContainer.innerHTML = ''; // Clear existing

        let hasActive = false;

        for (const perm of permissionsToCheck) {
            try {
                const result = await navigator.permissions.query({ name: perm.name });

                // We only care if it's 'granted'
                if (result.state === 'granted') {
                    const iconEl = document.createElement('span');
                    iconEl.className = 'perm-icon active';
                    iconEl.textContent = perm.icon;
                    iconEl.setAttribute('data-tooltip', perm.label);
                    permsContainer.appendChild(iconEl);
                    hasActive = true;
                }
            } catch (e) {
                // Some permissions might not be supported or throw errors in some contexts
                // console.log(`Permission check failed for ${perm.name}`, e);
            }
        }

        // Hide separator if no permissions active
        permsContainer.style.display = hasActive ? 'flex' : 'none';
    }

    function updateTheme(usedMB) {
        let colorVar = '0, 255, 127'; // Green

        if (usedMB > 1000) {
            colorVar = '255, 68, 68'; // Red
        } else if (usedMB > 500) {
            colorVar = '255, 187, 51'; // Orange
        }

        // Update the CSS variable on the overlay
        overlay.style.setProperty('--indicator-color', colorVar);
    }

    function updateMemoryUsage() {
        if (performance && performance.memory) {
            const usedJSHeapSize = performance.memory.usedJSHeapSize;
            const usedMB = (usedJSHeapSize / (1024 * 1024)).toFixed(1);

            ramText.textContent = `${usedMB} MB`;
            updateTheme(parseFloat(usedMB));
        } else {
            ramText.textContent = 'N/A';
        }
    }

    updateMemoryUsage();
    checkPermissions(); // Check once on load

    // Re-check every 5 seconds (permissions rarely change rapidly)
    setInterval(checkPermissions, 5000);
    setInterval(updateMemoryUsage, 2000);

    console.log('RAM Usage Monitor active.');
})();
