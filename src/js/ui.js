/**
 * UI class for handling the DOM updates and event listeners
 */
export class UI {
    constructor(timer, settings) {
        this.timer = timer;
        this.settings = settings;

        // DOM elements
        this.timerEl = document.getElementById('timer');
        this.sessionLabelEl = document.getElementById('session-label');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.progressBar = document.getElementById('progress');

        // Form elements
        this.workTimeInput = document.getElementById('work-time');
        this.shortBreakInput = document.getElementById('short-break');
        this.longBreakInput = document.getElementById('long-break');
        this.sessionsInput = document.getElementById('sessions-until-long-break');

        // Notification elements
        this.notification = document.getElementById('notification');
        this.notificationText = document.getElementById('notification-text');
        this.notificationCloseBtn = document.getElementById('notification-close');
    }

    /**
     * Initialize the UI and event listeners
     */
    initializeUI() {
        // Load settings into the form
        this.workTimeInput.value = this.settings.workTime;
        this.shortBreakInput.value = this.settings.shortBreakTime;
        this.longBreakInput.value = this.settings.longBreakTime;
        this.sessionsInput.value = this.settings.sessionsUntilLongBreak;

        // Initialize the timer display
        this.timerEl.textContent = this.timer.formatTime();

        // Set up timer event handlers
        this.setupTimerEvents();

        // Set up UI event listeners
        this.setupEventListeners();
    }

    /**
     * Show notification
     */
    showNotification(message) {
        this.notificationText.textContent = message;
        this.notification.classList.add('show');
    }

    /**
     * Hide notification
     */
    hideNotification() {
        this.notification.classList.remove('show');
    }

    /**
     * Set up timer event handlers
     */
    setupTimerEvents() {
        // Update UI on timer tick
        this.timer.onTick = (time, progress) => {
            this.timerEl.textContent = time;
            this.progressBar.style.width = `${progress}%`;

            // Add critical class when less than 10 seconds left
            if (this.timer.currentTime <= 10) {
                this.timerEl.classList.add('critical');
            } else {
                this.timerEl.classList.remove('critical');
            }
        };

        // Handle session completion
        this.timer.onSessionComplete = (completedSession) => {
            const nextSession = this.timer.currentSession;
            const message = `${completedSession.charAt(0).toUpperCase() + completedSession.slice(1)} session completed! Starting ${nextSession} session.`;
            this.showNotification(message);
        };

        // Update UI on session change
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

            // Update session label
            this.sessionLabelEl.textContent = sessionText;

            // Update UI to reflect current session type
            document.querySelector('.timer-container').classList.remove('work', 'short-break', 'long-break');
            document.querySelector('.timer-container').classList.add(sessionClass);
        };

        // Handle timer reset
        this.timer.onReset = (time) => {
            this.timerEl.textContent = time;
            this.progressBar.style.width = '0%';
            this.timerEl.classList.remove('critical', 'active');
            this.updateButtonStates();
        };
    }

    /**
     * Set up event listeners for UI controls
     */
    setupEventListeners() {
        // Timer controls
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

        // Notification close button
        this.notificationCloseBtn.addEventListener('click', () => {
            this.hideNotification();
        });

        // Settings changes
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
    }

    /**
     * Update button states based on timer state
     */
    updateButtonStates() {
        const { isRunning, isPaused } = this.timer;

        this.startBtn.disabled = isRunning && !isPaused;
        this.pauseBtn.disabled = !isRunning || isPaused;

        // Update button text based on state
        if (isPaused) {
            this.startBtn.textContent = 'Resume';
        } else {
            this.startBtn.textContent = 'Start';
        }
    }
}