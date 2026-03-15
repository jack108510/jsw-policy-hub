// Auth Module
const Auth = {
    currentUser: null,
    
    init() {
        const savedUser = localStorage.getItem('jsw_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
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
    
    signup(name, email, password, location) {
        const users = Data.getUsers();
        
        // Check if email already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return { success: false, message: 'Email already registered' };
        }
        
        // Create new user
        const newUser = {
            id: 'user_' + Date.now(),
            email: email,
            password: password,
            name: name,
            role: 'staff',
            clinicLocation: location,
            createdAt: Date.now()
        };
        
        Data.addUser(newUser);
        
        // Auto-login after signup
        this.currentUser = { ...newUser };
        delete this.currentUser.password;
        localStorage.setItem('jsw_current_user', JSON.stringify(this.currentUser));
        
        return { success: true, message: 'Account created successfully! Start your 14-day free trial.' };
    },
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('jsw_current_user');
        App.showLanding();
    },
    
    isAdmin() {
        return this.currentUser?.role === 'admin';
    },
    
    getCurrentUser() {
        return this.currentUser;
    }
};
