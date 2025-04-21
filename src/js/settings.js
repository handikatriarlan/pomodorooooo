export class Settings {
    constructor() {
        this.defaults = {
            workTime: 25,
            shortBreakTime: 5,
            longBreakTime: 15,
            sessionsUntilLongBreak: 4,
        };

        this.load();
    }

    load() {
        try {
            const savedSettings = localStorage.getItem('pomodoroSettings');

            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);

                this.workTime = parsedSettings.workTime || this.defaults.workTime;
                this.shortBreakTime = parsedSettings.shortBreakTime || this.defaults.shortBreakTime;
                this.longBreakTime = parsedSettings.longBreakTime || this.defaults.longBreakTime;
                this.sessionsUntilLongBreak = parsedSettings.sessionsUntilLongBreak || this.defaults.sessionsUntilLongBreak;
            } else {
                this.reset();
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            this.reset();
        }
    }

    save() {
        try {
            const settings = {
                workTime: this.workTime,
                shortBreakTime: this.shortBreakTime,
                longBreakTime: this.longBreakTime,
                sessionsUntilLongBreak: this.sessionsUntilLongBreak
            };

            localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    reset() {
        this.workTime = this.defaults.workTime;
        this.shortBreakTime = this.defaults.shortBreakTime;
        this.longBreakTime = this.defaults.longBreakTime;
        this.sessionsUntilLongBreak = this.defaults.sessionsUntilLongBreak;

        this.save();
    }
}