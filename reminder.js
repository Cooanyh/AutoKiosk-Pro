(function () {
    const style = document.createElement('style');
    style.textContent = `
        .autokiosk-reminder {
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: rgba(30, 41, 59, 0.95);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(79, 70, 229, 0.5);
            backdrop-filter: blur(10px);
            z-index: 999999;
            transform: translateX(120%);
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            max-width: 300px;
            font-family: 'Inter', system-ui, sans-serif;
        }
        .autokiosk-reminder.show {
            transform: translateX(0);
        }
        .autokiosk-reminder h4 {
            margin: 0 0 0.5rem 0;
            color: #818cf8;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .autokiosk-reminder p {
            margin: 0;
            font-size: 1rem;
            line-height: 1.5;
        }
    `;
    document.head.appendChild(style);

    const reminderEl = document.createElement('div');
    reminderEl.className = 'autokiosk-reminder';
    reminderEl.innerHTML = '<h4>Reminder</h4><p id="autokiosk-text"></p>';
    document.body.appendChild(reminderEl);

    window.electronAPI.onShowReminder((text) => {
        document.getElementById('autokiosk-text').textContent = text;
        reminderEl.classList.add('show');
        setTimeout(() => {
            reminderEl.classList.remove('show');
        }, 8000);
    });
})();
