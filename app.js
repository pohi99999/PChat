// P-Family Application JavaScript
class PFamilyApp {
    constructor() {
        this.currentProfile = null;
        this.currentSection = 'dashboard';
        this.currentMood = '😊';
        this.chatMessages = [];
        this.familyMessages = [];
        this.sosCountdown = null;
        
        // Sample data from provided JSON
        this.appData = {
            family_members: [
                {name: "Apa", emoji: "👨", color: "#4A90E2", points: 245, mood: "😊"},
                {name: "Anya", emoji: "👩", color: "#E24A90", points: 289, mood: "😄"},
                {name: "Gyerkőc", emoji: "👶", color: "#50C878", points: 156, mood: "🤗"}
            ],
            challenges: [
                {title: "Kreatív hét", description: "Készíts egy családi műalkotást", points: 50, category: "🎨", progress: 60},
                {title: "Aktív család", description: "Sportoljatok együtt 30 percet", points: 30, category: "⚽", progress: 80},
                {title: "Környezettudatosság", description: "Újrahasznosítsd a háztartási hulladékot", points: 25, category: "♻️", progress: 45},
                {title: "Tanulás", description: "Olvass egy mesét együtt", points: 20, category: "📚", progress: 100}
            ],
            ai_suggestions: [
                "A mai nap tökéletes egy természetjáráshoz! 🌞",
                "Gyerkőc fejlődik a számolásban, próbáljatok játékos matematikát! 🔢",
                "Ideje egy családi filmestének! 🎬",
                "Ne felejtsd el az esti meseolvasást! 📖"
            ],
            creative_activities: [
                {title: "AR Dinoszaurusz", icon: "🦕", description: "Fedezd fel a dinoszauruszokat AR-ben"},
                {title: "3D Rajzolás", icon: "🎨", description: "Készíts 3D műalkotást"},
                {title: "Zenei Alkotás", icon: "🎵", description: "Komponálj családi dalt"},
                {title: "Digitális Mese", icon: "📚", description: "Írj interaktív mesét"}
            ],
            family_timeline: [
                {time: "Ma 14:30", user: "Anya", action: "Feltöltött egy fotót", content: "🍰 Sütemény sütés Gyerkőccel!"},
                {time: "Ma 12:15", user: "Apa", action: "Teljesített egy kihívást", content: "⚽ Focizás a parkban - 30 pont!"},
                {time: "Tegnap 19:00", user: "Gyerkőc", action: "Új jelvényt szerzett", content: "📚 Olvasó bajnok jelvény!"}
            ]
        };

        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.setupEventListeners();
        this.initializeData();
        
        // Simulate loading time
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showProfileSelection();
        }, 3000);
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.remove('hidden');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }

    showProfileSelection() {
        const profileSelection = document.getElementById('profile-selection');
        profileSelection.classList.remove('hidden');
        profileSelection.classList.add('fade-in');
    }

    setupEventListeners() {
        // Profile selection
        document.querySelectorAll('.profile-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const profile = e.currentTarget.dataset.profile;
                this.selectProfile(profile);
            });
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Quick actions
        document.getElementById('sos-btn').addEventListener('click', () => this.showSOSModal());
        document.getElementById('creative-quick-btn').addEventListener('click', () => this.navigateToSection('creativity'));
        document.getElementById('family-chat-quick-btn').addEventListener('click', () => this.navigateToSection('family'));

        // AI Chat
        document.getElementById('send-chat').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });

        // Family Chat
        document.getElementById('send-family-message').addEventListener('click', () => this.sendFamilyMessage());
        document.getElementById('family-chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendFamilyMessage();
        });

        // Mood tracking
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setMood(e.currentTarget.dataset.mood);
            });
        });

        // Beta feedback
        document.getElementById('beta-feedback-btn').addEventListener('click', () => this.showBetaModal());
        document.getElementById('beta-feedback-full').addEventListener('click', () => this.showBetaModal());
        document.getElementById('close-beta-modal').addEventListener('click', () => this.closeBetaModal());

        // Profile switching
        document.getElementById('profile-switch-btn').addEventListener('click', () => this.showProfileSelection());

        // SOS Modal
        document.getElementById('cancel-emergency').addEventListener('click', () => this.cancelSOS());
        document.getElementById('call-now').addEventListener('click', () => this.callEmergency());

        // Safety features
        document.getElementById('emergency-btn').addEventListener('click', () => this.showSOSModal());
        document.getElementById('safe-walk-btn').addEventListener('click', () => this.startSafeWalk());
        document.getElementById('check-in-btn').addEventListener('click', () => this.checkIn());

        // Creative activities
        this.setupCreativeActivities();

        // Beta feedback form
        document.getElementById('beta-feedback-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitBetaFeedback();
        });

        // Rating stars
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', (e) => {
                this.setRating(e.currentTarget.dataset.rating);
            });
        });

        // AI floating button
        document.getElementById('ai-chat-floating').addEventListener('click', () => {
            this.navigateToSection('ai-assistant');
        });

        // Feature request
        document.getElementById('feature-request').addEventListener('click', () => {
            this.showFeatureRequest();
        });
    }

    selectProfile(profileType) {
        const profileData = this.appData.family_members.find(member => 
            member.name.toLowerCase() === profileType || 
            (profileType === 'gyerek' && member.name === 'Gyerkőc')
        );
        
        if (profileData) {
            this.currentProfile = profileData;
            this.currentMood = profileData.mood;
            this.updateCurrentProfile();
            this.hideProfileSelection();
            this.showMainApp();
        }
    }

    hideProfileSelection() {
        document.getElementById('profile-selection').classList.add('hidden');
    }

    showMainApp() {
        const mainApp = document.getElementById('main-app');
        mainApp.classList.remove('hidden');
        document.getElementById('ai-chat-floating').classList.remove('hidden');
        this.navigateToSection('dashboard');
    }

    updateCurrentProfile() {
        const profileElement = document.getElementById('current-profile');
        if (this.currentProfile) {
            profileElement.querySelector('.profile-emoji').textContent = this.currentProfile.emoji;
            profileElement.querySelector('.profile-name').textContent = this.currentProfile.name;
        }
    }

    navigateToSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.classList.add('slide-up');
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`.nav-item[data-section="${sectionName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        this.currentSection = sectionName;
    }

    initializeData() {
        this.populateAISuggestions();
        this.populateChallenges();
        this.populateCreativeActivities();
        this.populateFamilyTimeline();
        this.initializeChatWithWelcome();
    }

    populateAISuggestions() {
        const container = document.getElementById('ai-suggestions');
        container.innerHTML = '';
        
        this.appData.ai_suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.textContent = suggestion;
            container.appendChild(suggestionElement);
        });
    }

    populateChallenges() {
        const container = document.getElementById('challenges-list');
        container.innerHTML = '';

        this.appData.challenges.forEach(challenge => {
            const challengeElement = document.createElement('div');
            challengeElement.className = 'challenge-card';
            challengeElement.innerHTML = `
                <div class="challenge-header">
                    <div class="challenge-category">${challenge.category}</div>
                    <div class="challenge-points">+${challenge.points} pont</div>
                </div>
                <div class="challenge-title">${challenge.title}</div>
                <div class="challenge-description">${challenge.description}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${challenge.progress}%"></div>
                </div>
            `;
            
            challengeElement.addEventListener('click', () => {
                this.startChallenge(challenge);
            });
            
            container.appendChild(challengeElement);
        });
    }

    populateCreativeActivities() {
        const container = document.getElementById('creative-activities');
        container.innerHTML = '';

        this.appData.creative_activities.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.className = 'creative-activity';
            activityElement.innerHTML = `
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
            `;
            
            activityElement.addEventListener('click', () => {
                this.startCreativeActivity(activity);
            });
            
            container.appendChild(activityElement);
        });
    }

    populateFamilyTimeline() {
        const container = document.getElementById('family-timeline');
        container.innerHTML = '';

        this.appData.family_timeline.forEach(event => {
            const timelineElement = document.createElement('div');
            timelineElement.className = 'timeline-item';
            timelineElement.innerHTML = `
                <div class="timeline-time">${event.time}</div>
                <div class="timeline-content">
                    <div class="timeline-user">${event.user}</div>
                    <div class="timeline-action">${event.action}</div>
                    <div class="timeline-detail">${event.content}</div>
                </div>
            `;
            container.appendChild(timelineElement);
        });
    }

    initializeChatWithWelcome() {
        this.chatMessages = [{
            type: 'ai',
            content: `Szia ${this.currentProfile?.name || 'kedves'}! Én vagyok a P-Family AI asszisztensed. Hogyan segíthetek ma?`,
            timestamp: new Date()
        }];
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.addChatMessage('user', message);
            input.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                this.generateAIResponse(message);
            }, 1000);
        }
    }

    addChatMessage(type, content) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${type}`;
        
        const avatar = type === 'ai' ? '🤖' : this.currentProfile?.emoji || '👤';
        
        messageElement.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    generateAIResponse(userMessage) {
        const responses = [
            "Érdekes kérdés! Mit gondolsz, hogyan oldhatnánk meg ezt családként?",
            "Nagyszerű ötlet! Kipróbáltátok már valami hasonlót?",
            "Ez fontos téma a családban. Mit szólnának a többiek?",
            "Szuper! Segítek megtervezni, hogyan valósíthatnátok meg.",
            "Ezt imádom hallani! Milyen eredményeket vártok?"
        ];
        
        // Simple keyword-based responses
        let response = responses[Math.floor(Math.random() * responses.length)];
        
        if (userMessage.toLowerCase().includes('kihívás')) {
            response = "Látom érdekelnek a kihívások! Jelenleg 4 aktív kihívásotok van. Melyikkel kezdenéd?";
        } else if (userMessage.toLowerCase().includes('gyerek')) {
            response = "A gyerekekkel kapcsolatos dolgok mindig fontosak! Mit szeretnél tudni Gyerkőcről?";
        } else if (userMessage.toLowerCase().includes('kreatív')) {
            response = "A kreativitás fantasztikus! Van 4 új kreatív aktivitás, amit kipróbálhatsz. Melyik érdekel?";
        }
        
        this.addChatMessage('ai', response);
    }

    sendFamilyMessage() {
        const input = document.getElementById('family-chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.addFamilyMessage(this.currentProfile?.name || 'Te', message);
            input.value = '';
        }
    }

    addFamilyMessage(author, content) {
        const messagesContainer = document.getElementById('family-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'family-message';
        
        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        messageElement.innerHTML = `
            <div class="message-author">${this.getEmojiForUser(author)} ${author}</div>
            <div class="message-text">${content}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    getEmojiForUser(userName) {
        const member = this.appData.family_members.find(m => m.name === userName);
        return member ? member.emoji : '👤';
    }

    setMood(mood) {
        this.currentMood = mood;
        
        // Update UI
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-mood="${mood}"]`).classList.add('active');
        
        const moodTexts = {
            '😢': 'Szomorú',
            '😐': 'Semleges', 
            '😊': 'Jó',
            '😄': 'Boldog',
            '🤗': 'Fantasztikus'
        };
        
        document.getElementById('current-mood').textContent = `${mood} ${moodTexts[mood]}`;
        
        // Update profile mood
        if (this.currentProfile) {
            this.currentProfile.mood = mood;
        }
    }

    startChallenge(challenge) {
        // Simulate starting a challenge
        this.showNotification(`🎯 Kihívás elindítva: ${challenge.title}`, 'success');
        
        // Add some points
        if (this.currentProfile) {
            this.currentProfile.points += 5;
            this.showNotification(`+5 pont a kihívás elkezdéséért!`, 'success');
        }
    }

    startCreativeActivity(activity) {
        // Simulate starting creative activity
        this.showNotification(`🎨 ${activity.title} elindítva!`, 'success');
        
        // Simple simulation of activity
        if (activity.title.includes('AR')) {
            this.simulateARExperience();
        } else if (activity.title.includes('3D')) {
            this.simulate3DDrawing();
        } else if (activity.title.includes('Zenei')) {
            this.simulateMusic();
        } else {
            this.simulateStoryTelling();
        }
    }

    simulateARExperience() {
        this.showNotification('📱 AR kamera bekapcsolva... Keress dinoszauruszokat!', 'info');
        setTimeout(() => {
            this.showNotification('🦕 Wow! Egy T-Rex jelent meg!', 'success');
        }, 3000);
    }

    simulate3DDrawing() {
        this.showNotification('🎨 3D rajzeszköz aktiválva! Húzd az ujjad a levegőben!', 'info');
    }

    simulateMusic() {
        this.showNotification('🎵 Zenei stúdió megnyitva! Válassz hangszereket!', 'info');
    }

    simulateStoryTelling() {
        this.showNotification('📚 Interaktív mesemód! Mondj egy szót és folytatom...', 'info');
    }

    setupCreativeActivities() {
        // This method can be expanded for more detailed creative activity setups
    }

    showSOSModal() {
        document.getElementById('sos-modal').classList.remove('hidden');
        this.startSOSCountdown();
    }

    startSOSCountdown() {
        let count = 5;
        const countdownElement = document.getElementById('countdown');
        
        this.sosCountdown = setInterval(() => {
            count--;
            countdownElement.textContent = count;
            
            if (count <= 0) {
                this.callEmergency();
            }
        }, 1000);
    }

    cancelSOS() {
        if (this.sosCountdown) {
            clearInterval(this.sosCountdown);
            this.sosCountdown = null;
        }
        document.getElementById('sos-modal').classList.add('hidden');
        this.showNotification('SOS hívás törölve', 'info');
    }

    callEmergency() {
        if (this.sosCountdown) {
            clearInterval(this.sosCountdown);
            this.sosCountdown = null;
        }
        document.getElementById('sos-modal').classList.add('hidden');
        this.showNotification('🚨 Vészhelyzeti hívás indítása... 112', 'warning');
        // In a real app, this would trigger actual emergency services
    }

    startSafeWalk() {
        this.showNotification('🚶 Safe Walk mód aktiválva! Helyed követve...', 'success');
        // Simulate safe walk mode
    }

    checkIn() {
        this.showNotification('📍 Bejelentkezés sikeres! A család értesítve.', 'success');
    }

    showBetaModal() {
        document.getElementById('beta-modal').classList.remove('hidden');
    }

    closeBetaModal() {
        document.getElementById('beta-modal').classList.add('hidden');
    }

    setRating(rating) {
        document.querySelectorAll('.star').forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    submitBetaFeedback() {
        this.closeBetaModal();
        this.showNotification('📧 Visszajelzés elküldve! Köszönjük!', 'success');
    }

    showFeatureRequest() {
        this.showNotification('💡 Funkció kérés form megnyitva...', 'info');
        // Could open another modal for feature requests
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `status status--${type}`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '80px';
        notification.style.right = '20px';
        notification.style.zIndex = '1001';
        notification.style.maxWidth = '300px';
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('fade-in');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // PWA functions (simplified)
    enableOfflineMode() {
        // Simulate offline mode
        this.showNotification('📱 Offline mód engedélyezve', 'info');
    }

    syncData() {
        // Simulate data sync
        this.showNotification('🔄 Adatok szinkronizálva', 'success');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PFamilyApp();
});

// PWA Service Worker Registration (simplified)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
    // Could show install button here
});

// Handle online/offline events
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    new PFamilyApp().showNotification('🌐 Kapcsolat helyreállt', 'success');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    new PFamilyApp().showNotification('📱 Offline mód aktív', 'warning');
});

// Prevent default touch behaviors for better mobile experience
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Handle device orientation
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.scrollTo(0, 1);
    }, 500);
});

// Keyboard shortcuts (for development)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Toggle dark mode (if implemented)
    }
    
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        new PFamilyApp().showBetaModal();
    }
});

// Performance monitoring (simplified)
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`P-Family app loaded in ${loadTime.toFixed(2)}ms`);
    
    if (loadTime > 3000) {
        console.warn('App loading slower than expected');
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('P-Family App Error:', e.error);
    // Could send error reports in production
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // Could send error reports in production
});