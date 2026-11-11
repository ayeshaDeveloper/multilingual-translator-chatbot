// js/speech.js

const Speech = (() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionSupported = !!SpeechRecognition;
    const synthSupported = 'speechSynthesis' in window;

    let recognition = null;
    let isListening = false;
    let onResultCallback = null;
    let silenceTimer = null;

    // A helper to convert 'en' to 'en-US' so both mic and speaker work
    const getLangCode = (code) => {
        const langMap = {
            'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE',
            'it': 'it-IT', 'pt': 'pt-PT', 'ru': 'ru-RU', 'ar': 'ar-SA',
            'hi': 'hi-IN', 'ur': 'ur-PK', 'zh': 'zh-CN', 'ja': 'ja-JP',
            'ko': 'ko-KR', 'tr': 'tr-TR'
        };
        return langMap[code] || 'en-US';
    };

    // ---------- Speech-to-Text ----------
    function initRecognition() {
        if (!recognitionSupported) return;

        recognition = new SpeechRecognition();
        recognition.continuous = true; 
        recognition.interimResults = true; 
        
        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            // Loop through all results from the start
            for (let i = 0; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            // Send both final (confirmed) and interim (live) text to the UI
            if (onResultCallback) {
                onResultCallback(finalTranscript.trim(), interimTranscript.trim());
            }

            // Reset the silence timer every time you speak
            clearTimeout(silenceTimer);
            silenceTimer = setTimeout(() => {
                stopListening();
            }, 3000); // Stops after 3 seconds of complete silence
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            stopListening();
        };

        recognition.onend = () => {
            isListening = false;
            clearTimeout(silenceTimer);
            if (DOM.micBtn) DOM.micBtn.classList.remove('listening');
        };
    }

    function startListening(langCode, onResult) {
        if (!recognitionSupported) {
            alert('Speech Recognition not supported. Please use Google Chrome or Microsoft Edge.');
            return false;
        }
        if (!recognition) initRecognition();

        onResultCallback = onResult;
        recognition.lang = getLangCode(langCode);

        try {
            window.speechSynthesis.cancel(); // Stop any current TTS from interfering
            recognition.start();
            isListening = true;
            return true;
        } catch (err) {
            console.warn('Recognition start error:', err);
            return false;
        }
    }

    function stopListening() {
        if (recognition && isListening) {
            recognition.stop();
        }
        isListening = false;
        clearTimeout(silenceTimer);
    }

    // ---------- Text-to-Speech ----------
    function speak(text, langCode) {
        if (!synthSupported) return;
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // THIS WAS THE BUG: Fixed so it uses the full 'en-US' code!
        utterance.lang = getLangCode(langCode); 
        utterance.rate = 1.0;
        
        window.speechSynthesis.speak(utterance);
    }

    function stopSpeaking() {
        if (synthSupported) window.speechSynthesis.cancel();
    }

    return {
        recognitionSupported,
        synthSupported,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        isListening: () => isListening
    };
})();