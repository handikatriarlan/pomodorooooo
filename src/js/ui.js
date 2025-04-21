export class UI {
    constructor(timer, settings) {
        this.timer = timer;
        this.settings = settings;

        this.timerEl = document.getElementById('timer');
        this.sessionLabelEl = document.getElementById('session-label');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.progressBar = document.getElementById('progress');

        this.workTimeInput = document.getElementById('work-time');
        this.shortBreakInput = document.getElementById('short-break');
        this.longBreakInput = document.getElementById('long-break');
        this.sessionsInput = document.getElementById('sessions-until-long-break');

        this.notification = document.getElementById('notification');
        this.notificationText = document.getElementById('notification-text');
        this.notificationCloseBtn = document.getElementById('notification-close');

        this.settingsToggleBtn = document.getElementById('settings-toggle-btn');
        this.settingsContainer = document.querySelector('.settings-container');
    }

    initializeUI() {
        this.workTimeInput.value = this.settings.workTime;
        this.shortBreakInput.value = this.settings.shortBreakTime;
        this.longBreakInput.value = this.settings.longBreakTime;
        this.sessionsInput.value = this.settings.sessionsUntilLongBreak;

        this.timerEl.textContent = this.timer.formatTime();
        this.setupTimerEvents();
        this.setupEventListeners();
    }

    showNotification(message) {
        this.notificationText.textContent = message;
        this.notification.classList.add('show');
    }

    hideNotification() {
        this.notification.classList.remove('show');
    }

    setupTimerEvents() {
        this.timer.onTick = (time, progress) => {
            this.timerEl.textContent = time;
            this.progressBar.style.width = `${progress}%`;

            if (this.timer.currentTime <= 10) {
                this.timerEl.classList.add('critical');
            } else {
                this.timerEl.classList.remove('critical');
            }
        };

        this.timer.onSessionComplete = (completedSession) => {
            const nextSession = this.timer.currentSession;
            const message = `${completedSession.charAt(0).toUpperCase() + completedSession.slice(1)} session completed! Starting ${nextSession} session.`;
            this.showNotification(message);
        };

        this.timer.onSessionChange = (newSession) => {
            let sessionText = 'Work Session';
            let sessionClass = 'work';

            switch (newSession) {
                case 'shortBreak':
                    sessionText = 'Short Break';
                    sessionClass = 'short-break';
                    break;
                case 'longBreak':
                    sessionText = 'Long Break';
                    sessionClass = 'long-break';
                    break;
            }

            this.sessionLabelEl.textContent = sessionText;

            document.querySelector('.timer-container').classList.remove('work', 'short-break', 'long-break');
            document.querySelector('.timer-container').classList.add(sessionClass);
        };

        this.timer.onReset = (time) => {
            this.timerEl.textContent = time;
            this.progressBar.style.width = '0%';
            this.timerEl.classList.remove('critical', 'active');
            this.updateButtonStates();
        };
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => {
            if (this.timer.isPaused) {
                this.timer.resume();
            } else {
                this.timer.start();
            }
            this.timerEl.classList.add('active');
            this.updateButtonStates();
        });

        this.pauseBtn.addEventListener('click', () => {
            this.timer.pause();
            this.timerEl.classList.remove('active');
            this.updateButtonStates();
        });

        this.resetBtn.addEventListener('click', () => {
            this.timer.reset();
        });

        this.notificationCloseBtn.addEventListener('click', () => {
            this.hideNotification();
        });

        this.workTimeInput.addEventListener('change', () => {
            this.settings.workTime = parseInt(this.workTimeInput.value, 10);
            this.settings.save();
            if (this.timer.currentSession === 'work' && !this.timer.isRunning) {
                this.timer.currentTime = this.settings.workTime * 60;
                this.timerEl.textContent = this.timer.formatTime();
            }
        });

        this.shortBreakInput.addEventListener('change', () => {
            this.settings.shortBreakTime = parseInt(this.shortBreakInput.value, 10);
            this.settings.save();
            if (this.timer.currentSession === 'shortBreak' && !this.timer.isRunning) {
                this.timer.currentTime = this.settings.shortBreakTime * 60;
                this.timerEl.textContent = this.timer.formatTime();
            }
        });

        this.longBreakInput.addEventListener('change', () => {
            this.settings.longBreakTime = parseInt(this.longBreakInput.value, 10);
            this.settings.save();
            if (this.timer.currentSession === 'longBreak' && !this.timer.isRunning) {
                this.timer.currentTime = this.settings.longBreakTime * 60;
                this.timerEl.textContent = this.timer.formatTime();
            }
        });

        this.sessionsInput.addEventListener('change', () => {
            this.settings.sessionsUntilLongBreak = parseInt(this.sessionsInput.value, 10);
            this.settings.save();
        });

        this.settingsToggleBtn.addEventListener('click', () => {
            this.settingsContainer.classList.toggle('visible');
        });

        document.addEventListener('click', (event) => {
            if (!this.settingsContainer.contains(event.target) && !this.settingsToggleBtn.contains(event.target) && this.settingsContainer.classList.contains('visible')) {
                this.settingsContainer.classList.remove('visible');
            }
        });
    }

    updateButtonStates() {
        const { isRunning, isPaused } = this.timer;

        this.startBtn.disabled = isRunning && !isPaused;
        this.pauseBtn.disabled = !isRunning || isPaused;

        if (isPaused) {
            this.startBtn.textContent = 'Resume';
        } else {
            this.startBtn.textContent = 'Start';
        }
    }
}