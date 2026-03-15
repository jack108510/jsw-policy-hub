// Policies Module
const Policies = {
    currentPolicyId: null,
    
    init() {
        this.bindEvents();
        this.renderPolicyOptions();
    },
    
    bindEvents() {
        // New policy buttons
        document.getElementById('btn-new-policy').addEventListener('click', () => this.openModal());
        document.getElementById('btn-new-policy-2').addEventListener('click', () => this.openModal());
        
        // Policy form
        document.getElementById('policy-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const action = formData.get('action');
            this.savePolicy(action);
        });
        
        // Filter changes
        document.getElementById('filter-category').addEventListener('change', () => this.renderAllPolicies());
        document.getElementById('filter-status').addEventListener('change', () => this.renderAllPolicies());
        
        // View policy actions
        document.getElementById('btn-edit-policy').addEventListener('click', () => this.editCurrentPolicy());
        document.getElementById('btn-view-reads').addEventListener('click', () => this.viewReadReceipts());
        document.getElementById('btn-delete-policy').addEventListener('click', () => this.deleteCurrentPolicy());
    },
    
    renderPolicyOptions() {
        const categories = Data.getCategories();
        const categorySelects = [
            document.getElementById('filter-category'),
            document.getElementById('policy-category')
        ];
        
        categorySelects.forEach(select => {
            if (!select) return;
            const currentValue = select.value;
            select.innerHTML = '<option value="">All Categories</option>';
            categories.forEach(cat => {
                select.innerHTML += `<option value="${cat.name}" style="color:${cat.color}">${cat.name}</option>`;
            });
            if (currentValue) select.value = currentValue;
        });
    },
    
    openModal(policyId = null) {
        const modal = document.getElementById('policy-modal');
        const form = document.getElementById('policy-form');
        const title = document.getElementById('policy-modal-title');
        
        form.reset();
        this.renderPolicyOptions();
        
        if (policyId) {
            const policy = Data.getPolicy(policyId);
            title.textContent = 'Edit Policy';
            document.getElementById('policy-title').value = policy.title;
            document.getElementById('policy-category').value = policy.category;
            document.getElementById('policy-content').value = policy.content;
            document.querySelector(`input[name="priority"][value="${policy.priority}"]`).checked = true;
            this.currentPolicyId = policyId;
        } else {
            title.textContent = 'New Policy';
            this.currentPolicyId = null;
        }
        
        modal.classList.remove('hidden');
    },
    
    closeModal() {
        document.getElementById('policy-modal').classList.add('hidden');
        this.currentPolicyId = null;
    },
    
    savePolicy(action) {
        const title = document.getElementById('policy-title').value.trim();
        const category = document.getElementById('policy-category').value;
        const content = document.getElementById('policy-content').value.trim();
        const priority = document.querySelector('input[name="priority"]:checked').value;
        
        const policyData = {
            title,
            category,
            content,
            priority,
            status: action === 'publish' ? 'published' : 'draft',
            authorId: Auth.getCurrentUser().id
        };
        
        if (this.currentPolicyId) {
            Data.updatePolicy(this.currentPolicyId, policyData);
        } else {
            Data.addPolicy(policyData);
        }
        
        this.closeModal();
        App.refresh();
    },
    
    viewPolicy(policyId) {
        const policy = Data.getPolicy(policyId);
        const users = Data.getUsers();
        const categories = Data.getCategories();
        
        if (!policy) return;
        
        this.currentPolicyId = policyId;
        
        // Mark as read if staff
        if (!Auth.isAdmin()) {
            Data.markAsRead(policyId, Auth.getCurrentUser().id);
        }
        
        // Update UI
        document.getElementById('view-policy-title').textContent = policy.title;
        document.getElementById('view-policy-content').textContent = policy.content;
        
        // Category badge
        const category = categories.find(c => c.name === policy.category);
        const categoryBadge = document.getElementById('view-policy-category');
        categoryBadge.textContent = policy.category;
        categoryBadge.style.backgroundColor = category?.color || '#6B7280';
        
        // Priority badge
        const priorityBadge = document.getElementById('view-policy-priority');
        priorityBadge.textContent = policy.priority.charAt(0).toUpperCase() + policy.priority.slice(1);
        priorityBadge.className = 'policy-priority-badge priority-' + policy.priority;
        
        // Date
        document.getElementById('view-policy-date').textContent = new Date(policy.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        
        // Show/hide admin actions
        const adminActions = document.getElementById('view-policy-actions');
        if (Auth.isAdmin()) {
            adminActions.style.display = 'flex';
        } else {
            adminActions.style.display = 'none';
        }
        
        document.getElementById('policy-view-modal').classList.remove('hidden');
        App.refresh();
    },
    
    closeViewModal() {
        document.getElementById('policy-view-modal').classList.add('hidden');
        this.currentPolicyId = null;
    },
    
    editCurrentPolicy() {
        this.closeViewModal();
        setTimeout(() => this.openModal(this.currentPolicyId), 200);
    },
    
    deleteCurrentPolicy() {
        if (confirm('Are you sure you want to delete this policy?')) {
            Data.deletePolicy(this.currentPolicyId);
            this.closeViewModal();
            App.refresh();
        }
    },
    
    viewReadReceipts() {
        const reads = Data.getPolicyReads(this.currentPolicyId);
        const users = Data.getUsers();
        const policies = Data.getPolicies();
        
        // Get all staff (not admin)
        const staff = users.filter(u => u.role === 'staff');
        
        let html = '';
        
        staff.forEach(s => {
            const read = reads.find(r => r.userId === s.id);
            const readStatus = read && read.read;
            
            html += `
                <div class="read-item">
                    <div class="read-item-info">
                        <div class="read-avatar">${s.name.charAt(0)}</div>
                        <div>
                            <div class="read-name">${s.name}</div>
                            <div class="read-time">${readStatus ? 'Read ' + new Date(read.readAt).toLocaleString() : 'Not read yet'}</div>
                        </div>
                    </div>
                    <div class="read-status-icon">${readStatus ? '✅' : '⏳'}</div>
                </div>
            `;
        });
        
        if (!html) {
            html = '<p class="empty-state">No staff members to show</p>';
        }
        
        document.getElementById('reads-list').innerHTML = html;
        document.getElementById('reads-modal').classList.remove('hidden');
    },
    
    renderRecentPolicies() {
        const policies = Data.getPolicies()
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .slice(0, 5);
        
        const container = document.getElementById('recent-policies');
        
        if (policies.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📄</div><p>No policies yet</p></div>';
            return;
        }
        
        container.innerHTML = policies.map(p => this.renderPolicyCard(p)).join('');
        
        // Add click handlers
        container.querySelectorAll('.policy-card').forEach(card => {
            card.addEventListener('click', () => this.viewPolicy(card.dataset.id));
        });
    },
    
    renderAllPolicies() {
        const categoryFilter = document.getElementById('filter-category').value;
        const statusFilter = document.getElementById('filter-status').value;
        
        let policies = Data.getPolicies();
        
        if (categoryFilter) {
            policies = policies.filter(p => p.category === categoryFilter);
        }
        
        if (statusFilter) {
            policies = policies.filter(p => p.status === statusFilter);
        }
        
        // For staff, show only published
        if (!Auth.isAdmin()) {
            policies = policies.filter(p => p.status === 'published');
        }
        
        policies.sort((a, b) => b.updatedAt - a.updatedAt);
        
        const container = document.getElementById('all-policies');
        
        if (policies.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📄</div><p>No policies found</p></div>';
            return;
        }
        
        container.innerHTML = policies.map(p => this.renderPolicyCard(p)).join('');
        
        // Add click handlers
        container.querySelectorAll('.policy-card').forEach(card => {
            card.addEventListener('click', () => this.viewPolicy(card.dataset.id));
        });
    },
    
    renderPolicyCard(policy) {
        const categories = Data.getCategories();
        const category = categories.find(c => c.name === policy.category);
        
        // Read status for staff
        let readStatusHtml = '';
        if (!Auth.isAdmin()) {
            const hasRead = Data.hasRead(policy.id, Auth.getCurrentUser().id);
            readStatusHtml = `<span class="read-status ${hasRead ? 'read' : 'unread'}">${hasRead ? '✓ Read' : '○ Unread'}</span>`;
        }
        
        return `
            <div class="policy-card priority-${policy.priority}" data-id="${policy.id}">
                <div class="policy-card-header">
                    <h3 class="policy-card-title">${policy.title}</h3>
                </div>
                <p class="policy-card-excerpt">${policy.content.substring(0, 150)}...</p>
                <div class="policy-card-footer">
                    <div class="policy-meta">
                        <span class="policy-category-badge" style="background-color: ${category?.color || '#6B7280'}">${policy.category}</span>
                        <span class="policy-priority-badge priority-${policy.priority}">${policy.priority}</span>
                        <span class="policy-status status-${policy.status}">${policy.status}</span>
                    </div>
                    <div class="policy-meta">
                        <span class="policy-date">${new Date(policy.updatedAt).toLocaleDateString()}</span>
                        ${readStatusHtml}
                    </div>
                </div>
            </div>
        `;
    },
    
    updateStats() {
        const policies = Data.getPolicies();
        const users = Data.getUsers();
        
        const total = policies.length;
        const published = policies.filter(p => p.status === 'published').length;
        const staff = users.filter(u => u.role === 'staff').length;
        
        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-published').textContent = published;
        document.getElementById('stat-staff').textContent = staff;
        
        // Unread for staff
        const unreadCard = document.getElementById('stat-unread-card');
        const statUnread = document.getElementById('stat-unread');
        
        if (Auth.isAdmin()) {
            unreadCard.style.display = 'none';
        } else {
            unreadCard.style.display = 'flex';
            const userId = Auth.getCurrentUser().id;
            const unread = policies.filter(p => {
                return p.status === 'published' && !Data.hasRead(p.id, userId);
            }).length;
            statUnread.textContent = unread;
        }
    },
    
    updatePolicyBadge() {
        const policies = Data.getPolicies();
        document.getElementById('policy-count-badge').textContent = policies.length;
    }
};
