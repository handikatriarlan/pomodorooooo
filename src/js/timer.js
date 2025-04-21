/**
 * Timer class for handling Pomodoro timer logic
 */
export class Timer {
    constructor(settings) {
        this.settings = settings;

        // Timer states
        this.isRunning = false;
        this.isPaused = false;
        this.currentSession = 'work'; // 'work', 'shortBreak', 'longBreak'
        this.currentTime = this.settings.workTime * 60; // in seconds
        this.interval = null;
        this.sessionsCompleted = 0;

        // Event callbacks
        this.onTick = null;
        this.onSessionComplete = null;
        this.onSessionChange = null;
        this.onReset = null;
    }

    /**
     * Start the timer
     */
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.isPaused = false;

        this.interval = setInterval(() => {
            this.currentTime--;

            // Calculate progress percentage
            const totalTime = this.getTotalTimeForCurrentSession();
            const progress = 100 - (this.currentTime / totalTime * 100);

            // Call tick handler with current time and progress
            if (this.onTick) {
                this.onTick(this.formatTime(), progress);
            }

            // Session completed
            if (this.currentTime <= 0) {
                this.completeSession();
            }
        }, 1000);
    }

    /**
     * Pause the timer
     */
    pause() {
        if (!this.isRunning || this.isPaused) return;

        this.isPaused = true;
        this.isRunning = false;
        clearInterval(this.interval);
    }

    /**
     * Resume the timer
     */
    resume() {
        if (!this.isPaused) return;

        this.start();
    }

    /**
     * Reset the timer to initial state
     */
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.interval);

        this.currentSession = 'work';
        this.currentTime = this.settings.workTime * 60;

        if (this.onReset) {
            this.onReset(this.formatTime());
        }

        if (this.onSessionChange) {
            this.onSessionChange(this.currentSession);
        }
    }

    /**
     * Handle completion of current session
     */
    completeSession() {
        clearInterval(this.interval);
        this.isRunning = false;

        if (this.onSessionComplete) {
            this.onSessionComplete(this.currentSession);
        }

        // Determine next session type
        if (this.currentSession === 'work') {
            this.sessionsCompleted++;

            // After completing 4 work sessions, take a long break
            if (this.sessionsCompleted % this.settings.sessionsUntilLongBreak === 0) {
                this.currentSession = 'longBreak';
                this.currentTime = this.settings.longBreakTime * 60;
            } else {
                this.currentSession = 'shortBreak';
                this.currentTime = this.settings.shortBreakTime * 60;
            }
        } else {
            // After any break, go back to work
            this.currentSession = 'work';
            this.currentTime = this.settings.workTime * 60;
        }

        // Notify of session change
        if (this.onSessionChange) {
            this.onSessionChange(this.currentSession);
        }

        // Auto start next session
        this.start();
    }

    /**
     * Skip to the next session
     */
    skipToNextSession() {
        this.currentTime = 1; // Set to 1 second so it completes on next tick
    }

    /**
     * Get remaining time formatted as MM:SS
     */
    formatTime() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Get the total time in seconds for the current session
     */
    getTotalTimeForCurrentSession() {
        switch (this.currentSession) {
            case 'work':
                return this.settings.workTime * 60;
            case 'shortBreak':
                return this.settings.shortBreakTime * 60;
            case 'longBreak':
                return this.settings.longBreakTime * 60;
            default:
                return this.settings.workTime * 60;
        }
    }

    /**
     * Returns the current state of the timer
     */
    getState() {
        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            currentSession: this.currentSession,
            currentTime: this.currentTime,
            formattedTime: this.formatTime(),
            sessionsCompleted: this.sessionsCompleted
        };
    }
}