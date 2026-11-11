// js/storage.js

const Storage = {
    getHistory: function() {
        try {
            return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.HISTORY)) || [];
        } catch (e) {
            return [];
        }
    },

    saveHistory: function(history) {
        const trimmed = history.slice(-CONFIG.MAX_HISTORY);
        localStorage.setItem(CONFIG.STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
    },

    addEntry: function(entry) {
        const history = this.getHistory();
        history.push(entry);
        this.saveHistory(history);
    },

    clearHistory: function() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.HISTORY);
    },

    getPreferences: function() {
        try {
            return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PREFERENCES)) || {};
        } catch (e) {
            return {};
        }
    },

    savePreferences: function(prefs) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    },

    getSavedChats: function() {
        try {
            return JSON.parse(localStorage.getItem('translator_saved_chats')) || [];
        } catch (e) {
            return [];
        }
    },

    saveChatSession: function(messages) {
        if (!messages || messages.length === 0) return;
        
        const savedChats = this.getSavedChats();
        const newSession = {
            id: Date.now().toString(),
            date: new Date().toLocaleString(),
            messages: messages
        };
        
        savedChats.unshift(newSession);
        localStorage.setItem('translator_saved_chats', JSON.stringify(savedChats.slice(0, 10)));
    },

    deleteChatSession: function(id) {
        const savedChats = this.getSavedChats();
        const updatedChats = savedChats.filter(function(chat) {
            return chat.id !== id;
        });
        localStorage.setItem('translator_saved_chats', JSON.stringify(updatedChats));
    }
};