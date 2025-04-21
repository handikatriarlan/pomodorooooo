/**
 * Settings class for managing user preferences
 */
export class Settings {
    constructor() {
        // Default settings
        this.defaults = {
            workTime: 25,
            shortBreakTime: 5,
            longBreakTime: 15,
            sessionsUntilLongBreak: 4,
            soundEnabled: true,
            quoteEnabled: true
        };

        // Load saved settings or use defaults
        this.load();
    }

    /**
     * Load settings from localStorage
     */
    load() {
        try {
            const savedSettings = localStorage.getItem('pomodoroSettings');

            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);

                // Apply saved settings, falling back to defaults for any missing properties
                this.workTime = parsedSettings.workTime || this.defaults.workTime;
                this.shortBreakTime = parsedSettings.shortBreakTime || this.defaults.shortBreakTime;
                this.longBreakTime = parsedSettings.longBreakTime || this.defaults.longBreakTime;
                this.sessionsUntilLongBreak = parsedSettings.sessionsUntilLongBreak || this.defaults.sessionsUntilLongBreak;
                this.soundEnabled = parsedSettings.soundEnabled !== undefined ? parsedSettings.soundEnabled : this.defaults.soundEnabled;
                this.quoteEnabled = parsedSettings.quoteEnabled !== undefined ? parsedSettings.quoteEnabled : this.defaults.quoteEnabled;
            } else {
                // No saved settings, use defaults
                this.reset();
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            this.reset();
        }
    }

    /**
     * Save settings to localStorage
     */
    save() {
        try {
            const settings = {
                workTime: this.workTime,
                shortBreakTime: this.shortBreakTime,
                longBreakTime: this.longBreakTime,
                sessionsUntilLongBreak: this.sessionsUntilLongBreak,
                soundEnabled: this.soundEnabled,
                quoteEnabled: this.quoteEnabled
            };

            localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    /**
     * Reset settings to defaults
     */
    reset() {
        this.workTime = this.defaults.workTime;
        this.shortBreakTime = this.defaults.shortBreakTime;
        this.longBreakTime = this.defaults.longBreakTime;
        this.sessionsUntilLongBreak = this.defaults.sessionsUntilLongBreak;
        this.soundEnabled = this.defaults.soundEnabled;
        this.quoteEnabled = this.defaults.quoteEnabled;

        // Save defaults to localStorage
        this.save();
    }
}