// js/translator.js

const Translator = {
    async translate(text, sourceLang, targetLang) {
        if (!text || !text.trim()) return '';

        // MyMemory limit: ~500 bytes per request → chunk long input
        const chunks = this._chunkText(text, 450);
        const results = [];

        for (const chunk of chunks) {
            const translated = await this._translateChunk(chunk, sourceLang, targetLang);
            results.push(translated);
        }

        return results.join(' ');
    },

    async _translateChunk(text, sourceLang, targetLang) {
        const langPair = `${sourceLang}|${targetLang}`;
        const url = `${CONFIG.API_URL}?q=${encodeURIComponent(text)}&langpair=${langPair}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            if (data.responseStatus === 200) {
                return data.responseData.translatedText;
            }
            console.warn('Translation API message:', data.responseDetails);
            return `[Translation failed: ${data.responseDetails || 'unknown error'}]`;
        } catch (err) {
            console.error('Translation error:', err);
            return '[Network error — could not translate]';
        }
    },


    _chunkText(text, maxBytes) {
        const encoder = new TextEncoder();
        const chunks = [];
        let current = '';

        // Split by words to keep meaning intact
        for (const word of text.split(/(\s+)/)) {
            const candidate = current + word;
            if (encoder.encode(candidate).length > maxBytes && current) {
                chunks.push(current.trim());
                current = word.trim() + ' ';
            } else {
                current = candidate;
            }
        }
        if (current.trim()) chunks.push(current.trim());
        return chunks.length ? chunks : [text];
    }
};