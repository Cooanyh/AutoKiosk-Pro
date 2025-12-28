(function () {
    // Inject marked.js for markdown rendering
    const markedScript = document.createElement('script');
    markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    document.head.appendChild(markedScript);

    const style = document.createElement('style');
    style.textContent = `
        .autokiosk-floating-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(79, 70, 229, 0.7);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 999997;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
        }
        .autokiosk-floating-btn:hover {
            background: rgba(79, 70, 229, 0.95);
            transform: scale(1.1);
        }
        .autokiosk-floating-btn.highlight {
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7); }
            50% { box-shadow: 0 0 0 15px rgba(79, 70, 229, 0); }
        }
        .autokiosk-tooltip {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(15, 23, 42, 0.95);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            z-index: 999997;
            max-width: 200px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
        }
        .autokiosk-tooltip.show {
            opacity: 1;
            visibility: visible;
        }
        .autokiosk-tooltip::after {
            content: '';
            position: absolute;
            bottom: -8px;
            right: 20px;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid rgba(15, 23, 42, 0.95);
        }
        .autokiosk-reminder {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: rgba(15, 23, 42, 0.98);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(79, 70, 229, 0.5);
            backdrop-filter: blur(20px);
            z-index: 999999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            max-width: 500px;
            min-width: 300px;
            font-family: 'Inter', system-ui, sans-serif;
        }
        .autokiosk-reminder.show {
            opacity: 1;
            visibility: visible;
            transform: translate(-50%, -50%) scale(1);
        }
        .autokiosk-reminder-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .autokiosk-reminder h4 {
            margin: 0;
            color: #818cf8;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .autokiosk-reminder-close {
            background: #ef4444;
            border: none;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }
        .autokiosk-reminder-close:hover {
            transform: scale(1.1);
        }
        .autokiosk-reminder-content {
            font-size: 1rem;
            line-height: 1.6;
        }
        .autokiosk-reminder-content h1,
        .autokiosk-reminder-content h2,
        .autokiosk-reminder-content h3 {
            margin-top: 0.5rem;
            color: #c084fc;
        }
        .autokiosk-reminder-content code {
            background: #334155;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
        }
        .autokiosk-reminder-content pre {
            background: #1e293b;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
        }
        .autokiosk-reminder-content a {
            color: #60a5fa;
        }
        .autokiosk-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999998;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s;
        }
        .autokiosk-overlay.show {
            opacity: 1;
            visibility: visible;
        }
    `;
    document.head.appendChild(style);

    // Create floating button
    const floatingBtn = document.createElement('button');
    floatingBtn.className = 'autokiosk-floating-btn';
    floatingBtn.innerHTML = '⚙️';
    floatingBtn.title = 'Settings (Ctrl+S)';
    document.body.appendChild(floatingBtn);

    // Create tooltip for first launch
    const tooltip = document.createElement('div');
    tooltip.className = 'autokiosk-tooltip';
    tooltip.innerHTML = '👋 点击此按钮打开设置<br>快捷键: <strong>Ctrl+S</strong>';
    document.body.appendChild(tooltip);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'autokiosk-overlay';
    document.body.appendChild(overlay);

    // Create reminder modal
    const reminderEl = document.createElement('div');
    reminderEl.className = 'autokiosk-reminder';
    reminderEl.innerHTML = `
        <div class="autokiosk-reminder-header">
            <h4>📢 提醒</h4>
            <button class="autokiosk-reminder-close" id="autokiosk-close">×</button>
        </div>
        <div class="autokiosk-reminder-content" id="autokiosk-text"></div>
    `;
    document.body.appendChild(reminderEl);

    function closeReminder() {
        reminderEl.classList.remove('show');
        overlay.classList.remove('show');
    }

    document.getElementById('autokiosk-close').addEventListener('click', closeReminder);
    overlay.addEventListener('click', closeReminder);

    // Floating button click - open settings
    floatingBtn.addEventListener('click', () => {
        window.electronAPI.openSettings();
    });

    // Check if should show floating button and first launch highlight
    window.electronAPI.getConfig().then(config => {
        if (config.showFloatingBtn === false) {
            floatingBtn.style.display = 'none';
        }

        // First launch highlight
        if (!config.firstLaunchDone) {
            floatingBtn.classList.add('highlight');
            tooltip.classList.add('show');

            // Hide tooltip after 5 seconds
            setTimeout(() => {
                tooltip.classList.remove('show');
                floatingBtn.classList.remove('highlight');
            }, 5000);

            // Mark first launch as done
            window.electronAPI.markFirstLaunchDone();
        }
    });

    // Listen for show reminder
    window.electronAPI.onShowReminder((text) => {
        const renderContent = () => {
            if (typeof marked !== 'undefined') {
                document.getElementById('autokiosk-text').innerHTML = marked.parse(text);
            } else {
                document.getElementById('autokiosk-text').textContent = text;
            }
        };

        if (typeof marked !== 'undefined') {
            renderContent();
        } else {
            markedScript.onload = renderContent;
        }

        reminderEl.classList.add('show');
        overlay.classList.add('show');
    });
})();
