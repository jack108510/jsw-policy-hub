// Main App
const App = {
    currentView: 'dashboard',
    
    init() {
        Data.init();
        Auth.init();
        
        this.bindEvents();
        
        if (Auth.currentUser) {
            this.showApp();
        } else {
            this.showLanding();
        }
    },
    
    bindEvents() {
        // Landing page buttons
        document.getElementById('btn-start-trial').addEventListener('click', () => {
            this.showSignup();
        });
        
        document.getElementById('btn-try-demo').addEventListener('click', () => {
            // Auto-login as demo admin
            const result = Auth.login('admin@jsw.com', 'admin123');
            if (result.success) {
                this.showApp();
            }
        });
        
        document.getElementById('landing-login-btn').addEventListener('click', () => {
            this.showLogin();
        });
        
        // Switch between login and signup
        document.getElementById('switch-to-signup').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSignup();
        });
        
        document.getElementById('switch-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLogin();
        });
        
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const result = Auth.login(email, password);
            
            if (result.success) {
                this.showApp();
            } else {
                alert(result.message);
            }
        });
        
        // Signup form
        document.getElementById('signup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const location = document.getElementById('signup-location').value;
            
            const result = Auth.signup(name, email, password, location);
            
            if (result.success) {
                alert(result.message);
                this.showApp();
            } else {
                alert(result.message);
            }
        });
        
        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            Auth.logout();
        });
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.navigateTo(view);
            });
        });
        
        // Menu toggle
        document.getElementById('menu-toggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });
        
        // Close modals - handle both .modal-close and data-close attributes
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            });
        });
        
        // Handle data-close buttons
        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.close;
                if (modalId) {
                    const modal = document.getElementById(modalId);
                    if (modal) modal.classList.add('hidden');
                }
            });
        });
        
        // Modal overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', () => {
                overlay.closest('.modal').classList.add('hidden');
            });
        });
        
        // Settings
        document.getElementById('category-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCategory();
        });
        
        document.getElementById('btn-export-data').addEventListener('click', () => this.exportData());
        document.getElementById('btn-import-data').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        document.getElementById('import-file').addEventListener('change', (e) => this.importData(e));
    },
    
    showLanding() {
        document.getElementById('landing-screen').classList.remove('hidden');
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('signup-screen').classList.add('hidden');
        document.getElementById('app').classList.add('hidden');
    },
    
    showLogin() {
        document.getElementById('landing-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('signup-screen').classList.add('hidden');
        document.getElementById('app').classList.add('hidden');
    },
    
    showSignup() {
        document.getElementById('landing-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('signup-screen').classList.remove('hidden');
        document.getElementById('app').classList.add('hidden');
    },
    
    showApp() {
        document.getElementById('landing-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('signup-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        
        // Update user badge
        const user = Auth.getCurrentUser();
        let badgeText = user.name;
        if (user.clinicLocation) {
            badgeText += ` (${user.clinicLocation})`;
        }
        badgeText += ` [${user.role}]`;
        document.getElementById('user-badge').textContent = badgeText;
        
        // Show/hide admin features
        this.updateAdminFeatures();
        
        // Initialize modules
        Policies.init();
        Staff.init();
        AI.init();
        
        // Refresh data
        this.refresh();
    },
    
    updateAdminFeatures() {
        const isAdmin = Auth.isAdmin();
        
        // Show/hide admin nav items
        document.getElementById('nav-staff').style.display = isAdmin ? 'flex' : 'none';
        document.getElementById('nav-settings').style.display = isAdmin ? 'flex' : 'none';
        document.getElementById('nav-ai').style.display = 'flex';
        
        // Staff stat card
        document.getElementById('stat-staff-card').style.display = isAdmin ? 'flex' : 'none';
    },
    
    navigateTo(view) {
        // Check permission
        if (view === 'staff' && !Auth.isAdmin()) return;
        if (view === 'settings' && !Auth.isAdmin()) return;
        
        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });
        
        // Update views
        document.querySelectorAll('.view').forEach(v => {
            v.classList.toggle('active', v.id === 'view-' + view);
        });
        
        this.currentView = view;
        
        // Close mobile menu
        document.getElementById('sidebar').classList.remove('open');
        
        // Refresh data
        this.refresh();
    },
    
    refresh() {
        // Update header badge
        const user = Auth.getCurrentUser();
        document.getElementById('user-badge').textContent = `${user.name} (${user.role})`;
        
        // Update based on current view
        if (this.currentView === 'dashboard') {
            Policies.updateStats();
            Policies.renderRecentPolicies();
        } else if (this.currentView === 'policies') {
            Policies.renderAllPolicies();
        } else if (this.currentView === 'staff') {
            Staff.renderStaff();
        } else if (this.currentView === 'settings') {
            this.renderCategories();
        }
        
        // Always update policy badge
        Policies.updatePolicyBadge();
    },
    
    // Categories
    addCategory() {
        const name = document.getElementById('new-category').value.trim();
        const color = document.getElementById('new-category-color').value;
        
        if (!name) return;
        
        Data.addCategory({ name, color });
        document.getElementById('new-category').value = '';
        
        this.renderCategories();
        Policies.renderPolicyOptions();
    },
    
    deleteCategory(id) {
        if (confirm('Delete this category?')) {
            Data.deleteCategory(id);
            this.renderCategories();
            Policies.renderPolicyOptions();
        }
    },
    
    renderCategories() {
        const categories = Data.getCategories();
        
        document.getElementById('category-list').innerHTML = categories.map(c => `
            <div class="category-item">
                <span class="category-color" style="background-color: ${c.color}"></span>
                <span>${c.name}</span>
                <button class="category-delete" onclick="App.deleteCategory('${c.id}')">×</button>
            </div>
        `).join('');
    },
    
    deleteCategory(id) {
        if (confirm('Delete this category?')) {
            Data.deleteCategory(id);
            this.renderCategories();
            Policies.renderPolicyOptions();
        }
    },
    
    // Export/Import
    exportData() {
        const data = Data.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'jsw-policy-data-' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        
        URL.revokeObjectURL(url);
    },
    
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                Data.importData(data);
                alert('Data imported successfully!');
                this.refresh();
            } catch (err) {
                alert('Error importing data: ' + err.message);
            }
        };
        reader.readAsText(file);
        
        event.target.value = '';
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
