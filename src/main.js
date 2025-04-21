import './style/style.css';
import { Timer } from './js/timer.js';
import { UI } from './js/ui.js';
import { Settings } from './js/settings.js';

document.addEventListener('DOMContentLoaded', () => {
  const settings = new Settings();
  const timer = new Timer(settings);
  const ui = new UI(timer, settings);

  ui.initializeUI();
});