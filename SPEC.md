# Policy App - Technical Specification

## 1. Project Overview

**Project Name:** JSW Policy Hub  
**Type:** Single-Page Web Application  
**Core Functionality:** A digital policy management system that replaces paper memos with AI-assisted policy creation, staff access control, and read tracking.  
**Target Users:** JSW Enterprises staff and administrators

---

## 2. UI/UX Specification

### Layout Structure

**Header (64px height)**
- Logo/App name on left
- User role indicator + logout button on right
- Fixed position, always visible

**Main Content Area**
- Sidebar navigation (240px width, collapsible on mobile)
- Content panel (flexible width)

**Responsive Breakpoints**
- Mobile: < 768px (sidebar becomes hamburger menu)
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Visual Design

**Color Palette**
- Primary: `#1E3A5F` (Deep Navy)
- Secondary: `#3D5A80` (Slate Blue)
- Accent: `#EE6C4D` (Coral Orange)
- Background: `#F7F9FC` (Light Gray-Blue)
- Surface: `#FFFFFF` (White)
- Text Primary: `#1A1A2E` (Near Black)
- Text Secondary: `#6B7280` (Gray)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)

**Typography**
- Headings: "DM Sans", sans-serif (700 weight)
- Body: "DM Sans", sans-serif (400, 500 weight)
- Font sizes:
  - H1: 32px
  - H2: 24px
  - H3: 20px
  - Body: 16px
  - Small: 14px

**Spacing System**
- Base unit: 8px
- Padding: 16px, 24px, 32px
- Margins: 8px, 16px, 24px
- Border radius: 8px (cards), 4px (buttons), 12px (modals)

**Visual Effects**
- Card shadows: `0 2px 8px rgba(0,0,0,0.08)`
- Hover shadows: `0 4px 16px rgba(0,0,0,0.12)`
- Transitions: 200ms ease-out
- Focus rings: 2px solid accent color with 2px offset

### Components

**Navigation Sidebar**
- Dashboard link
- Policies link (with count badge)
- Staff link (admin only)
- AI Assistant link
- Settings link (admin only)

**Policy Card**
- Title, excerpt, category badge
- Created date, author
- Read status indicator (read/unread)
- Hover: lift effect with shadow

**Policy Editor**
- Title input
- Rich text area for content
- Category dropdown
- Priority selector (Normal/Important/Urgent)
- Save/Publish buttons

**AI Assistant Panel**
- Chat-style interface
- Input field with send button
- Policy suggestions as clickable cards

**Staff Table**
- Name, email, role, status
- Actions: Edit, Deactivate

**Read Receipts Modal**
- List of staff who read/unread
- Timestamp for each read

---

## 3. Functionality Specification

### Core Features

#### Authentication & Access Control
- Login screen with email/password
- Two roles: `admin` (Jack) and `staff`
- Demo accounts pre-configured:
  - Admin: `admin@jsw.com` / `admin123`
  - Staff: `staff@jsw.com` / `staff123`
- Session stored in localStorage
- Role-based UI visibility

#### Dashboard
- Statistics cards: Total Policies, Published, Unread (for staff), Staff Count
- Recent policies list (last 5)
- Quick action buttons

#### Policy Management (CRUD)
- **Create**: Manual editor or AI-assisted
- **Read**: Full policy view with formatting
- **Update**: Edit existing policies
- **Delete**: Soft delete (archive)
- **List**: Filterable by category, status, date

#### AI Policy Creation
- AI Assistant chat interface
- User describes policy need
- AI generates draft policy
- User can edit, save, or regenerate
- Uses OpenAI API (requires API key in settings)

#### Publish to Staff
- Publish button changes status to "Published"
- Published policies appear in staff dashboard
- Notification count shown to staff

#### Read Tracking
- When staff opens a policy, timestamp recorded
- Admin can view read receipts per policy
- Shows: Staff name, read date/time, read status

#### Categories
- Default categories: HR, Operations, Safety, Finance, General
- Admin can add custom categories
- Color-coded badges

### Data Models (localStorage)

```javascript
// Users
{
  id: string,
  email: string,
  name: string,
  role: "admin" | "staff",
  createdAt: timestamp
}

// Policies
{
  id: string,
  title: string,
  content: string,
  category: string,
  priority: "normal" | "important" | "urgent",
  status: "draft" | "published",
  authorId: string,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Read Receipts
{
  policyId: string,
  userId: string,
  readAt: timestamp,
  read: boolean
}

// Categories
{
  id: string,
  name: string,
  color: string
}
```

### Edge Cases
- Empty states for no policies, no staff
- API key missing: show setup prompt, disable AI features gracefully
- Long policy content: truncate in cards, full view in modal
- Concurrent edits: last save wins (simple for demo)

---

## 4. Technical Implementation

### File Structure
```
policy-app/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── policies.js
│   ├── ai.js
│   └── staff.js
├── data/
│   └── seed.js
└── README.md
```

### External Dependencies
- Google Fonts: DM Sans
- No framework (vanilla JS)
- OpenAI API (optional, graceful fallback)

---

## 5. Acceptance Criteria

- [ ] Login works with demo accounts
- [ ] Admin can create, edit, publish, delete policies
- [ ] AI assistant generates policy drafts (when API key provided)
- [ ] Staff can view published policies
- [ ] Read receipts tracked and visible to admin
- [ ] Categories filter works
- [ ] Responsive on mobile
- [ ] Deployable to GitHub Pages
