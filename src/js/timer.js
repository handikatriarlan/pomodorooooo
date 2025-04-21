export class Timer {
    constructor(settings) {
        this.settings = settings;

        this.isRunning = false;
        this.isPaused = false;
        this.currentSession = 'work';
        this.currentTime = this.settings.workTime * 60;
        this.interval = null;
        this.sessionsCompleted = 0;

        this.onTick = null;
        this.onSessionComplete = null;
        this.onSessionChange = null;
        this.onReset = null;
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.isPaused = false;

        this.interval = setInterval(() => {
            this.currentTime--;

            const totalTime = this.getTotalTimeForCurrentSession();
            const progress = 100 - (this.currentTime / totalTime * 100);

            if (this.onTick) {
                this.onTick(this.formatTime(), progress);
            }

            if (this.currentTime <= 0) {
                this.completeSession();
            }
        }, 1000);
    }

    pause() {
        if (!this.isRunning || this.isPaused) return;

        this.isPaused = true;
        this.isRunning = false;
        clearInterval(this.interval);
    }

    resume() {
        if (!this.isPaused) return;

        this.start();
    }

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

    completeSession() {
        clearInterval(this.interval);
        this.isRunning = false;

        if (this.onSessionComplete) {
            this.onSessionComplete(this.currentSession);
        }

        if (this.currentSession === 'work') {
            this.sessionsCompleted++;

            if (this.sessionsCompleted % this.settings.sessionsUntilLongBreak === 0) {
                this.currentSession = 'longBreak';
                this.currentTime = this.settings.longBreakTime * 60;
            } else {
                this.currentSession = 'shortBreak';
                this.currentTime = this.settings.shortBreakTime * 60;
            }
        } else {
            this.currentSession = 'work';
            this.currentTime = this.settings.workTime * 60;
        }

        if (this.onSessionChange) {
            this.onSessionChange(this.currentSession);
        }

        this.start();
    }

    skipToNextSession() {
        this.currentTime = 1;
    }

    formatTime() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

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