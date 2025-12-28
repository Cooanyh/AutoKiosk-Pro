(function () {
    // Inject marked.js for markdown rendering
    const markedScript = document.createElement('script');
    markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    document.head.appendChild(markedScript);

    const style = document.createElement('style');
    style.textContent = `
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

    const overlay = document.createElement('div');
    overlay.className = 'autokiosk-overlay';
    document.body.appendChild(overlay);

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

    window.electronAPI.onShowReminder((text) => {
        // Wait for marked.js to load
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
