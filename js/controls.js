// js/controls.js

const Controls = {
    init() {
        this._populateLanguageSelectors();
        this._bindMic();
        this._bindSend();
        this._bindSwap();
        this._bindLanguageChange();
        this._bindNewFeatures(); // Bind new UI buttons
    },

    _populateLanguageSelectors() {
        CONFIG.LANGUAGES.forEach(lang => {
            const opt1 = new Option(lang.name, lang.code);
            const opt2 = new Option(lang.name, lang.code);
            DOM.sourceLang.appendChild(opt1);
            DOM.targetLang.appendChild(opt2);
        });

        const prefs = Storage.getPreferences();
        DOM.sourceLang.value = prefs.sourceLang || 'en';
        DOM.targetLang.value = prefs.targetLang || 'es';
    },

    _bindMic() {
        DOM.micBtn.addEventListener('click', () => {
            if (!Speech.recognitionSupported) {
                alert('Speech Recognition not supported in this browser. Try Chrome or Edge.');
                return;
            }

            if (Speech.isListening()) {
                Speech.stopListening();
                DOM.micBtn.classList.remove('listening');
                return;
            }

            DOM.micBtn.classList.add('listening');
            const sourceCode = DOM.sourceLang.value;
            const textBeforeMic = DOM.textInput.value.trim();

            Speech.startListening(sourceCode, (finalText, interimText) => {
                let combinedText = textBeforeMic;
                if (finalText) combinedText += (combinedText ? ' ' : '') + finalText;
                if (interimText) combinedText += (combinedText ? ' ' : '') + interimText;
                DOM.textInput.value = combinedText;
                DOM.textInput.focus();
            });
        });
    },

    _bindSend() {
        DOM.sendBtn.addEventListener('click', () => this._handleSend());

        DOM.textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this._handleSend();
            }
        });
    },

    async _handleSend() {
        const text = DOM.textInput.value.trim();
        if (!text) return;

        const sourceLang = DOM.sourceLang.value;
        const targetLang = DOM.targetLang.value;

        DOM.textInput.value = '';
        Chat.addMessage('user', text);
        Chat.addTypingIndicator();

        const translated = await Translator.translate(text, sourceLang, targetLang);
        Chat.removeTypingIndicator();

        Chat.addMessage('bot', translated, {
            langCode: targetLang,
            showPlay: true,
            showCopy: true
        });

        Speech.speak(translated, targetLang);

        Storage.addEntry({
            source: sourceLang,
            target: targetLang,
            original: text,
            translated,
            timestamp: Date.now()
        });
    },

    _bindSwap() {
        DOM.swapLangBtn.addEventListener('click', () => {
            const s = DOM.sourceLang.value;
            const t = DOM.targetLang.value;
            DOM.sourceLang.value = t;
            DOM.targetLang.value = s;
            this._savePrefs();
        });
    },

    _bindLanguageChange() {
        DOM.sourceLang.addEventListener('change', () => this._savePrefs());
        DOM.targetLang.addEventListener('change', () => this._savePrefs());
    },

    _savePrefs() {
        Storage.savePreferences({
            sourceLang: DOM.sourceLang.value,
            targetLang: DOM.targetLang.value
        });
    },

    _bindNewFeatures() {
        // --- New Chat Button ---
        document.getElementById('newChatBtn').addEventListener('click', () => {
            if (Chat.currentMessages.length > 0) {
                Storage.saveChatSession(Chat.currentMessages);
            }
            Chat.clear();
            Chat.addMessage('bot', '✨ New chat started. History saved.');
            Storage.clearHistory();
        });

        // --- History Sidebar Toggle ---
        const sidebar = document.getElementById('sidebar');
        
        document.getElementById('historyBtn').addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            if (!sidebar.classList.contains('hidden')) {
                Chat.renderHistoryList();
            }
        });

        document.getElementById('closeSidebarBtn').addEventListener('click', () => {
            sidebar.classList.add('hidden');
        });
    }
};