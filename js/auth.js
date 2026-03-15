// Auth Module
const Auth = {
    currentUser: null,
    
    init() {
        const savedUser = localStorage.getItem('jsw_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            App.showApp();
        } else {
            App.showLogin();
        }
    },
    
    login(email, password) {
        const users = Data.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = { ...user };
            delete this.currentUser.password;
            localStorage.setItem('jsw_current_user', JSON.stringify(this.currentUser));
            return { success: true };
        }
        
        return { success: false, message: 'Invalid email or password' };
    },
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('jsw_current_user');
        App.showLogin();
    },
    
    isAdmin() {
        return this.currentUser?.role === 'admin';
    },
    
    getCurrentUser() {
        return this.currentUser;
    }
};
