// Data Module - Handles localStorage
const Data = {
    KEYS: {
        USERS: 'jsw_users',
        POLICIES: 'jsw_policies',
        CATEGORIES: 'jsw_categories',
        READS: 'jsw_reads',
        SETTINGS: 'jsw_settings'
    },
    
    init() {
        // Initialize with seed data if empty
        if (!localStorage.getItem(this.KEYS.USERS)) {
            this.seedData();
        }
    },
    
    seedData() {
        // Seed users
        const users = [
            { id: 'user_1', email: 'admin@jsw.com', password: 'admin123', name: 'Jack (Admin)', role: 'admin', createdAt: Date.now() },
            { id: 'user_2', email: 'staff@jsw.com', password: 'staff123', name: 'John Smith', role: 'staff', createdAt: Date.now() },
            { id: 'user_3', email: 'sarah@jsw.com', password: 'staff123', name: 'Sarah Johnson', role: 'staff', createdAt: Date.now() }
        ];
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
        
        // Seed categories
        const categories = [
            { id: 'cat_1', name: 'HR', color: '#3D5A80' },
            { id: 'cat_2', name: 'Operations', color: '#10B981' },
            { id: 'cat_3', name: 'Safety', color: '#EF4444' },
            { id: 'cat_4', name: 'Finance', color: '#F59E0B' },
            { id: 'cat_5', name: 'General', color: '#6B7280' }
        ];
        localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(categories));
        
        // Seed policies
        const policies = [
            {
                id: 'policy_1',
                title: 'Remote Work Policy',
                content: `Remote Work Policy

PURPOSE
This policy establishes guidelines for employees who work remotely.

SCOPE
This policy applies to all eligible employees as determined by their department manager.

POLICY
1. Eligibility
   - Employees must have completed their probationary period
   - Manager approval is required
   - Role must be suitable for remote work

2. Equipment
   - Company will provide necessary equipment
   - Employees must maintain a secure workspace
   - Internet connection must meet minimum requirements

3. Communication
   - Must be available during core hours (9 AM - 3 PM)
   - Response time within 2 hours during work hours
   - Weekly check-ins with manager required

4. Security
   - VPN required for all company access
   - Company data must not be stored on personal devices
   - Password requirements apply

EFFECTIVE DATE
This policy is effective immediately.`,
                category: 'HR',
                priority: 'important',
                status: 'published',
                authorId: 'user_1',
                createdAt: Date.now() - 86400000 * 5,
                updatedAt: Date.now() - 86400000 * 5
            },
            {
                id: 'policy_2',
                title: 'Office Safety Guidelines',
                content: `Office Safety Guidelines

PURPOSE
To ensure a safe working environment for all employees.

GUIDELINES

1. Emergency Procedures
   - Know your evacuation route
   - Identify emergency exits
   - Assembly point is the parking lot

2. First Aid
   - First aid kit located in reception
   - AED device near main entrance
   - Emergency numbers posted

3. Ergonomics
   - Desk chair properly adjusted
   - Monitor at eye level
   - Take regular breaks

4. Reporting Hazards
   - Report immediately to facilities
   - Use incident report form
   - Document all incidents`,
                category: 'Safety',
                priority: 'urgent',
                status: 'published',
                authorId: 'user_1',
                createdAt: Date.now() - 86400000 * 3,
                updatedAt: Date.now() - 86400000 * 3
            },
            {
                id: 'policy_3',
                title: 'Expense Reimbursement Policy',
                content: `Expense Reimbursement Policy

PURPOSE
To establish guidelines for business expense reimbursement.

ELIGIBLE EXPENSES
- Travel (airfare, hotel, transportation)
- Meals with clients
- Professional development
- Office supplies

REQUIREMENTS
1. Receipts required for all expenses over $25
2. Submit within 30 days
3. Manager approval required

REIMBURSEMENT PROCESS
1. Complete expense report form
2. Attach all receipts
3. Submit to finance department
4. Processing time: 2 weeks`,
                category: 'Finance',
                priority: 'normal',
                status: 'published',
                authorId: 'user_1',
                createdAt: Date.now() - 86400000 * 2,
                updatedAt: Date.now() - 86400000 * 2
            },
            {
                id: 'policy_4',
                title: 'Draft: Social Media Guidelines',
                content: `[DRAFT - Under Review]

Social Media Guidelines

This is a draft policy regarding social media usage...

To be completed with AI assistance.`,
                category: 'General',
                priority: 'normal',
                status: 'draft',
                authorId: 'user_1',
                createdAt: Date.now() - 86400000,
                updatedAt: Date.now() - 86400000
            }
        ];
        localStorage.setItem(this.KEYS.POLICIES, JSON.stringify(policies));
        
        // Seed read receipts (some read, some not)
        const reads = [
            { policyId: 'policy_1', userId: 'user_2', readAt: Date.now() - 86400000 * 4, read: true },
            { policyId: 'policy_2', userId: 'user_2', readAt: Date.now() - 86400000 * 2, read: true },
            { policyId: 'policy_3', userId: 'user_2', readAt: Date.now() - 86400000, read: true },
            { policyId: 'policy_1', userId: 'user_3', readAt: Date.now() - 86400000 * 3, read: true },
            { policyId: 'policy_2', userId: 'user_3', readAt: Date.now() - 86400000 * 2, read: true }
        ];
        localStorage.setItem(this.KEYS.READS, JSON.stringify(reads));
        
        // Default settings
        const settings = {
            apiKey: ''
        };
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },
    
    // Users
    getUsers() {
        return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
    },
    
    addUser(user) {
        const users = this.getUsers();
        user.id = 'user_' + Date.now();
        user.createdAt = Date.now();
        users.push(user);
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
        return user;
    },
    
    updateUser(id, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
        }
    },
    
    // Policies
    getPolicies() {
        return JSON.parse(localStorage.getItem(this.KEYS.POLICIES) || '[]');
    },
    
    getPolicy(id) {
        const policies = this.getPolicies();
        const policy = policies.find(p => p.id === id);
        if (!policy) {
            console.warn(`Policy with id ${id} not found`);
            return null;
        }
        return policy;
    },
    
    addPolicy(policy) {
        const policies = this.getPolicies();
        policy.id = 'policy_' + Date.now();
        policy.createdAt = Date.now();
        policy.updatedAt = Date.now();
        policies.unshift(policy);
        localStorage.setItem(this.KEYS.POLICIES, JSON.stringify(policies));
        return policy;
    },
    
    updatePolicy(id, updates) {
        const policies = this.getPolicies();
        const index = policies.findIndex(p => p.id === id);
        if (index !== -1) {
            policies[index] = { ...policies[index], ...updates, updatedAt: Date.now() };
            localStorage.setItem(this.KEYS.POLICIES, JSON.stringify(policies));
        }
    },
    
    deletePolicy(id) {
        const policies = this.getPolicies();
        const index = policies.findIndex(p => p.id === id);
        if (index !== -1) {
            policies.splice(index, 1);
            localStorage.setItem(this.KEYS.POLICIES, JSON.stringify(policies));
        }
    },
    
    // Categories
    getCategories() {
        return JSON.parse(localStorage.getItem(this.KEYS.CATEGORIES) || '[]');
    },
    
    addCategory(category) {
        const categories = this.getCategories();
        category.id = 'cat_' + Date.now();
        categories.push(category);
        localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(categories));
        return category;
    },
    
    deleteCategory(id) {
        const categories = this.getCategories();
        const index = categories.findIndex(c => c.id === id);
        if (index !== -1) {
            categories.splice(index, 1);
            localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(categories));
        }
    },
    
    // Read Receipts
    getReads() {
        return JSON.parse(localStorage.getItem(this.KEYS.READS) || '[]');
    },
    
    getPolicyReads(policyId) {
        const reads = this.getReads();
        return reads.filter(r => r.policyId === policyId);
    },
    
    markAsRead(policyId, userId) {
        const reads = this.getReads();
        const existing = reads.find(r => r.policyId === policyId && r.userId === userId);
        
        if (existing) {
            existing.readAt = Date.now();
            existing.read = true;
        } else {
            reads.push({
                policyId,
                userId,
                readAt: Date.now(),
                read: true
            });
        }
        
        localStorage.setItem(this.KEYS.READS, JSON.stringify(reads));
    },
    
    hasRead(policyId, userId) {
        const reads = this.getReads();
        return reads.some(r => r.policyId === policyId && r.userId === userId && r.read);
    },
    
    // Settings
    getSettings() {
        return JSON.parse(localStorage.getItem(this.KEYS.SETTINGS) || '{}');
    },
    
    saveSettings(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },
    
    // Export/Import
    exportData() {
        return {
            users: this.getUsers(),
            policies: this.getPolicies(),
            categories: this.getCategories(),
            reads: this.getReads(),
            settings: this.getSettings()
        };
    },
    
    importData(data) {
        if (data.users) localStorage.setItem(this.KEYS.USERS, JSON.stringify(data.users));
        if (data.policies) localStorage.setItem(this.KEYS.POLICIES, JSON.stringify(data.policies));
        if (data.categories) localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(data.categories));
        if (data.reads) localStorage.setItem(this.KEYS.READS, JSON.stringify(data.reads));
        if (data.settings) localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(data.settings));
    }
};
