# JSW Policy Hub

A digital policy management system that replaces paper memos with AI-assisted policy creation, staff access control, and read tracking.

## Features

- **AI Policy Creation** - Use OpenAI to generate policy drafts
- **Easy Policy Editor** - Simple form-based policy creation
- **Publish to Staff** - Push policies to all staff members
- **Access Control** - Admin and staff roles with login
- **Read Tracking** - Track who has read each policy
- **Replace Paper Memos** - Digital replacement for paper postings

## Demo Accounts

- **Admin:** admin@jsw.com / admin123
- **Staff:** staff@jsw.com / staff123

## Tech Stack

- Frontend: HTML/CSS/Vanilla JS
- Storage: localStorage (no backend required)
- AI: OpenAI API (optional)

## Getting Started

1. Clone this repository
2. Open `index.html` in a browser
3. Login with demo credentials
4. Configure OpenAI API key in Settings (optional)

## Deployment to GitHub Pages

1. Create a new repository on GitHub
2. Push this code to the repository
3. Go to Settings → Pages
4. Select "main" branch as source
5. Your app will be available at `https://yourusername.github.io/repo-name`

## File Structure

```
policy-app/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── app.js          # Main app logic
│   ├── auth.js         # Authentication
│   ├── data.js         # Data/storage layer
│   ├── policies.js     # Policy management
│   ├── staff.js        # Staff management
│   └── ai.js           # AI assistant
└── README.md           # This file
```

## License

MIT
