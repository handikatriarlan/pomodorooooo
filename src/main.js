import './style/style.css';
import { Timer } from './js/timer.js';
import { UI } from './js/ui.js';
import { Settings } from './js/settings.js';

// Initialize app components
document.addEventListener('DOMContentLoaded', () => {
  const settings = new Settings();
  const timer = new Timer(settings);
  const ui = new UI(timer, settings);

  // Initialize UI and event listeners
  ui.initializeUI();
});