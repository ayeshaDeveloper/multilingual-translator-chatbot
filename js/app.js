// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Wire up all event listeners + language dropdowns
    Controls.init();

    // 2. Restore previous conversation
    const history = Storage.getHistory();
    if (history.length) {
        Chat.renderHistory(history);
    } else {
        Chat.addMessage('bot', '👋 Hi! Type or speak a message and I\'ll translate it for you.');
    }

    // 3. Friendliness check for missing APIs
    if (!Speech.recognitionSupported) {
        console.warn('⚠️ Speech Recognition unavailable — use Chrome/Edge for voice input.');
    }
    if (!Speech.synthSupported) {
        console.warn('⚠️ Speech Synthesis unavailable — audio playback disabled.');
    }
});