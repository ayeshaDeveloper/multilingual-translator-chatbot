// js/chat.js

const Chat = {
    currentMessages: [], // Track the active session

    addMessage(sender, text, options = {}) {
        const { langCode = null, showPlay = false, showCopy = false } = options;

        const bubble = document.createElement('div');
        bubble.className = `message ${sender}`;

        const textEl = document.createElement('div');
        textEl.className = 'message-text';
        textEl.textContent = text;
        bubble.appendChild(textEl);

        if (showPlay || showCopy) {
            const actions = document.createElement('div');
            actions.className = 'message-actions';

            if (showPlay) {
                const playBtn = document.createElement('button');
                playBtn.textContent = '🔊';
                playBtn.title = 'Play audio';
                playBtn.addEventListener('click', () => Speech.speak(text, langCode));
                actions.appendChild(playBtn);

                const stopBtn = document.createElement('button');
                stopBtn.textContent = '⏹';
                stopBtn.title = 'Stop audio';
                stopBtn.addEventListener('click', () => Speech.stopSpeaking());
                actions.appendChild(stopBtn);
            }

            if (showCopy) {
                const copyBtn = document.createElement('button');
                copyBtn.textContent = '📋';
                copyBtn.title = 'Copy translation';
                copyBtn.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(text);
                        copyBtn.textContent = '✅';
                        setTimeout(() => (copyBtn.textContent = '📋'), 1500);
                    } catch {
                        alert('Copy failed.');
                    }
                });
                actions.appendChild(copyBtn);
            }

            bubble.appendChild(actions);
        }

        DOM.chatWindow.appendChild(bubble);
        DOM.chatWindow.scrollTop = DOM.chatWindow.scrollHeight;

        // Save to current memory
        if (sender === 'user' || sender === 'bot') {
            this.currentMessages.push({ sender, text, options });
        }
    },

    addTypingIndicator() {
        const bubble = document.createElement('div');
        bubble.className = 'message bot typing';
        bubble.id = 'typingIndicator';
        bubble.innerHTML = '<span></span><span></span><span></span>';
        DOM.chatWindow.appendChild(bubble);
        DOM.chatWindow.scrollTop = DOM.chatWindow.scrollHeight;
    },

    removeTypingIndicator() {
        const el = document.getElementById('typingIndicator');
        if (el) el.remove();
    },

    clear() {
        DOM.chatWindow.innerHTML = '';
        this.currentMessages = []; // Reset memory
    },

    renderHistory(history, append = false) {
        if (!append) this.clear();
        history.forEach(entry => {
            if (entry.sender && entry.text) {
                // Loading from Saved Session
                this.addMessage(entry.sender, entry.text, entry.options || {});
            } else {
                // Loading from old LocalStorage format
                this.addMessage('user', entry.original);
                this.addMessage('bot', entry.translated, {
                    langCode: entry.target,
                    showPlay: true,
                    showCopy: true
                });
            }
        });
    },

    // renderHistoryList() {
    //     const listEl = document.getElementById('historyList');
    //     listEl.innerHTML = '';
    //     const chats = Storage.getSavedChats();

    //     if (chats.length === 0) {
    //         listEl.innerHTML = '<div class="empty-history">No saved chats yet.</div>';
    //         return;
    //     }

    //     chats.forEach(chat => {
    //         const item = document.createElement('div');
    //         item.className = 'history-item';
            
    //         const firstMsg = chat.messages.find(m => m.sender === 'user');
    //         const title = firstMsg ? firstMsg.text : 'Empty Chat';

    //         item.innerHTML = `
    //             <div>${title.substring(0, 25)}${title.length > 25 ? '...' : ''}</div>
    //             <span class="date">${chat.date}</span>
    //         `;

    //         item.addEventListener('click', () => {
    //             this.renderHistory(chat.messages);
    //             document.getElementById('sidebar').classList.add('hidden');
    //         });

    //         listEl.appendChild(item);
    //     });
    // }
    // js/chat.js

    renderHistoryList() {
        const listEl = document.getElementById('historyList');
        if (!listEl) return;
        
        listEl.innerHTML = '';
        const chats = Storage.getSavedChats();

        if (!chats || chats.length === 0) {
            listEl.innerHTML = '<div class="empty-history">No saved chats yet.</div>';
            return;
        }

        // Use 'self' to refer to the Chat object inside the click events
        const self = this;

        chats.forEach(function(chat) {
            const item = document.createElement('div');
            item.className = 'history-item';
            
            // Get the first message to use as the title
            let title = 'Empty Chat';
            if (chat.messages && chat.messages.length > 0) {
                const firstMsg = chat.messages.find(function(m) { return m.sender === 'user'; });
                if (firstMsg && firstMsg.text) title = firstMsg.text;
            }
            const shortTitle = title.substring(0, 20) + (title.length > 20 ? '...' : '');

            // Create the Top Row (Flexbox for Text and Trash Icon)
            const topRow = document.createElement('div');
            topRow.style.display = 'flex';
            topRow.style.justifyContent = 'space-between';
            topRow.style.alignItems = 'center';
            topRow.style.marginBottom = '4px';

            // 1. The Chat Title
            const textDiv = document.createElement('div');
            textDiv.textContent = shortTitle;
            textDiv.style.flex = '1';
            textDiv.style.overflow = 'hidden';
            textDiv.style.textOverflow = 'ellipsis';
            textDiv.style.whiteSpace = 'nowrap';

            // 2. The Delete Button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.title = "Delete Chat";
            deleteBtn.style.background = 'none';
            deleteBtn.style.border = 'none';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.padding = '0 4px';
            deleteBtn.style.fontSize = '0.9rem';
            
            // Delete Logic
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // CRITICAL: Prevents the chat from loading when deleting
                if (confirm('Are you sure you want to delete this chat?')) {
                    Storage.deleteChatSession(chat.id);
                    self.renderHistoryList(); // Refresh the list instantly
                }
            });

            topRow.appendChild(textDiv);
            topRow.appendChild(deleteBtn);

            // Create the Date
            const dateSpan = document.createElement('span');
            dateSpan.className = 'date';
            dateSpan.textContent = chat.date;

            // Assemble the item
            item.appendChild(topRow);
            item.appendChild(dateSpan);

            // Load Chat Logic (Clicking anywhere else on the item)
            item.addEventListener('click', function() {
                self.renderHistory(chat.messages); 
                document.getElementById('sidebar').classList.add('hidden');
            });

            listEl.appendChild(item);
        });
    }
};