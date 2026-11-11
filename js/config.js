// js/config.js

const CONFIG = {
    // MyMemory supported language pairs (subset)
    LANGUAGES: [
        { code: 'en', name: 'English',   tts: 'en-US' },
        { code: 'es', name: 'Spanish',   tts: 'es-ES' },
        { code: 'fr', name: 'French',    tts: 'fr-FR' },
        { code: 'de', name: 'German',    tts: 'de-DE' },
        { code: 'it', name: 'Italian',   tts: 'it-IT' },
        { code: 'pt', name: 'Portuguese',tts: 'pt-PT' },
        { code: 'ru', name: 'Russian',   tts: 'ru-RU' },
        { code: 'ar', name: 'Arabic',    tts: 'ar-SA' },
        { code: 'hi', name: 'Hindi',     tts: 'hi-IN' },
        { code: 'ur', name: 'Urdu',      tts: 'ur-PK' },
        { code: 'zh', name: 'Chinese',   tts: 'zh-CN' },
        { code: 'ja', name: 'Japanese',  tts: 'ja-JP' },
        { code: 'ko', name: 'Korean',    tts: 'ko-KR' },
        { code: 'tr', name: 'Turkish',   tts: 'tr-TR' }
    ],

    API_URL: 'https://api.mymemory.translated.net/get',

    STORAGE_KEYS: {
        HISTORY: 'translator_history',
        PREFERENCES: 'translator_prefs'
    },

    MAX_HISTORY: 50
};

// Cache DOM elements once so other files can use them
const DOM = {
    sourceLang:  document.getElementById('sourceLang'),
    targetLang:  document.getElementById('targetLang'),
    swapLangBtn: document.getElementById('swapLangBtn'),
    chatWindow:  document.getElementById('chatWindow'),
    textInput:   document.getElementById('textInput'),
    micBtn:      document.getElementById('micBtn'),
    sendBtn:     document.getElementById('sendBtn')
};