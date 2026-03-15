// Staff Module
const Staff = {
    currentStaffId: null,
    
    init() {
        this.bindEvents();
    },
    
    bindEvents() {
        document.getElementById('btn-add-staff').addEventListener('click', () => this.openModal());
        document.getElementById('staff-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveStaff();
        });
    },
    
    openModal(staffId = null) {
        const modal = document.getElementById('staff-modal');
        const form = document.getElementById('staff-form');
        const title = document.getElementById('staff-modal-title');
        
        form.reset();
        
        if (staffId) {
            const users = Data.getUsers();
            const staff = users.find(u => u.id === staffId);
            title.textContent = 'Edit Staff';
            document.getElementById('staff-name').value = staff.name;
            document.getElementById('staff-email').value = staff.email;
            // Security: Don't show password - leave empty for new password entry
            document.getElementById('staff-password').value = '';
            document.getElementById('staff-password').placeholder = 'Leave blank to keep current password';
            document.getElementById('staff-role').value = staff.role;
            this.currentStaffId = staffId;
        } else {
            title.textContent = 'Add Staff';
            document.getElementById('staff-password').placeholder = 'Password';
            this.currentStaffId = null;
        }
        
        modal.classList.remove('hidden');
    },
    
    closeModal() {
        document.getElementById('staff-modal').classList.add('hidden');
        this.currentStaffId = null;
    },
    
    saveStaff() {
        const name = document.getElementById('staff-name').value.trim();
        const email = document.getElementById('staff-email').value.trim();
        const password = document.getElementById('staff-password').value;
        const role = document.getElementById('staff-role').value;
        
        if (this.currentStaffId) {
            // Only update password if a new one is provided
            const users = Data.getUsers();
            const existingUser = users.find(u => u.id === this.currentStaffId);
            const updates = { name, email, role };
            if (password) {
                updates.password = password;
            }
            Data.updateUser(this.currentStaffId, updates);
        } else {
            // New user requires password
            if (!password) {
                alert('Password is required for new staff members');
                return;
            }
            Data.addUser({ name, email, password, role });
        }
        
        this.closeModal();
        App.refresh();
    },
    
    editStaff(staffId) {
        this.openModal(staffId);
    },
    
    deleteStaff(staffId) {
        if (confirm('Are you sure you want to remove this staff member?')) {
            const users = Data.getUsers();
            const user = users.find(u => u.id === staffId);
            
            // Don't allow deleting self
            if (user.id === Auth.getCurrentUser().id) {
                alert('You cannot delete your own account');
                return;
            }
            
            // Soft delete - just remove from list
            const updatedUsers = users.filter(u => u.id !== staffId);
            localStorage.setItem('jsw_users', JSON.stringify(updatedUsers));
            
            App.refresh();
        }
    },
    
    renderStaff() {
        const users = Data.getUsers();
        const staff = users.filter(u => u.role !== 'admin' || u.id === Auth.getCurrentUser().id);
        
        const tbody = document.getElementById('staff-tbody');
        
        if (staff.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No staff members</td></tr>';
            return;
        }
        
        tbody.innerHTML = staff.map(s => `
            <tr>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td><span class="status-badge ${s.role === 'admin' ? 'status-active' : 'status-active'}">${s.role}</span></td>
                <td><span class="status-badge status-active">Active</span></td>
                <td class="staff-actions">
                    <button class="btn btn-outline btn-small" onclick="Staff.editStaff('${s.id}')">Edit</button>
                    ${s.id !== Auth.getCurrentUser().id ? `<button class="btn btn-danger btn-small" onclick="Staff.deleteStaff('${s.id}')">Delete</button>` : ''}
                </td>
            </tr>
        `).join('');
    }
};
