// AI Module
const AI = {
    apiKey: null,
    
    init() {
        this.loadApiKey();
        this.bindEvents();
    },
    
    loadApiKey() {
        const settings = Data.getSettings();
        this.apiKey = settings.apiKey || '';
        
        if (this.apiKey) {
            document.getElementById('ai-setup').classList.add('hidden');
            document.getElementById('ai-chat').classList.remove('hidden');
        } else {
            document.getElementById('ai-setup').classList.remove('hidden');
            document.getElementById('ai-chat').classList.add('hidden');
        }
    },
    
    bindEvents() {
        document.getElementById('btn-save-api-key').addEventListener('click', () => this.saveApiKey());
        document.getElementById('btn-send-ai').addEventListener('click', () => this.sendMessage());
        document.getElementById('ai-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    },
    
    saveApiKey() {
        const apiKey = document.getElementById('api-key-input').value.trim();
        
        if (!apiKey) {
            alert('Please enter an API key');
            return;
        }
        
        if (!apiKey.startsWith('sk-')) {
            alert('Invalid API key format. Should start with "sk-"');
            return;
        }
        
        const settings = Data.getSettings();
        settings.apiKey = apiKey;
        Data.saveSettings(settings);
        this.apiKey = apiKey;
        
        document.getElementById('ai-setup').classList.add('hidden');
        document.getElementById('ai-chat').classList.remove('hidden');
    },
    
    async sendMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show loading
        this.showLoading();
        
        try {
            const response = await this.generatePolicy(message);
            this.hideLoading();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideLoading();
            this.addMessage('Sorry, I encountered an error: ' + error.message, 'bot');
        }
    },
    
    async generatePolicy(prompt) {
        if (!this.apiKey) {
            return 'Please configure your OpenAI API key in Settings to use AI features.';
        }
        
        const systemPrompt = `You are a professional policy writer for a company called JSW Enterprises. 
Write clear, professional policies in markdown format.
Include sections like: PURPOSE, SCOPE, POLICY, and EFFECTIVE DATE.
Keep policies concise but comprehensive.
Use bullet points for lists.
Respond only to policy-related requests.`;
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API request failed');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    },
    
    addMessage(content, sender) {
        const container = document.getElementById('ai-messages');
        const isUser = sender === 'user';
        
        const messageHtml = `
            <div class="ai-message ${isUser ? 'ai-message-user' : 'ai-message-bot'}">
                <div class="message-avatar">${isUser ? '👤' : '🤖'}</div>
                <div class="message-content">
                    ${this.formatMessage(content)}
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', messageHtml);
        container.scrollTop = container.scrollHeight;
    },
    
    formatMessage(content) {
        // Convert markdown-like formatting to HTML
        let formatted = content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n- /g, '</p><ul><li>')
            .replace(/\n\d+\. /g, '</p><ol><li>');
        
        // Wrap in paragraphs
        if (!formatted.startsWith('<')) {
            formatted = '<p>' + formatted + '</p>';
        }
        
        // Add "Use Policy" button for AI responses
        if (!content.startsWith('Sorry')) {
            formatted += `<button class="btn btn-primary btn-small" style="margin-top:12px" onclick="AI.usePolicy(\`${content.replace(/`/g, '\\`')}\`)">Create Policy from This</button>`;
        }
        
        return formatted;
    },
    
    showLoading() {
        const container = document.getElementById('ai-messages');
        container.insertAdjacentHTML('beforeend', `
            <div class="ai-message ai-message-bot" id="ai-loading">
                <div class="message-avatar">🤖</div>
                <div class="message-content ai-loading">Thinking...</div>
            </div>
        `);
        container.scrollTop = container.scrollHeight;
    },
    
    hideLoading() {
        const loading = document.getElementById('ai-loading');
        if (loading) loading.remove();
    },
    
    usePolicy(content) {
        // Fill the policy form with AI-generated content
        Policies.openModal();
        
        // Try to extract title from content
        const lines = content.split('\n');
        const title = lines[0].replace(/^#+\s*/, '').trim();
        
        document.getElementById('policy-title').value = title;
        document.getElementById('policy-content').value = content;
        
        // Switch to policies view
        App.navigateTo('policies');
    }
};
