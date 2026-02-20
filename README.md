# AuronexMedia Blog 📝

A modern, professional blog platform built with React, TypeScript, TailwindCSS, and Supabase.

![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue)

---

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to **SQL Editor** → **New Query**
4. Copy content from `supabase-schema.sql` and run it
5. Get credentials from **Settings** → **API**

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Verify Setup
```bash
node verify-categories-tags.js
```

### 5. Start Development
```bash
npm start
```

Visit `http://localhost:3000` 🎉

### 6. Create Admin Account
1. Go to `http://localhost:3000/admin/login`
2. Click "Sign up"
3. Create your account
4. Start creating content!

---

## ✨ Features

### 🤖 AI-Powered HTML Import (NEW!)
- **Drag & drop HTML files** - Instant article creation
- **Smart content extraction** - Auto-detects title, content, images
- **AI categorization** - Suggests best category based on content
- **Auto tag suggestions** - Recommends 3-5 relevant tags
- **SEO excerpt generation** - Creates optimized summaries
- **One-click publishing** - From HTML to live article in seconds

### 🎨 Modern Admin Panel
- Clean interface with smooth animations
- Real-time statistics dashboard
- Rich text editor with Visual/HTML modes
- Category and tag management
- Comment moderation
- Contact form management

### 📝 Content Management
- Create, edit, delete posts
- Draft, scheduled, published statuses
- Categories: Business, Finance, SaaS, Startups, AI, Reviews
- 50+ organized tags
- SEO-friendly URLs
- View count tracking
- Estimated read time

### 🔐 Security
- Supabase authentication
- Row Level Security (RLS)
- Admin-only access
- Secure session management

### 📱 Responsive Design
- Mobile-first approach
- Works on all devices
- Professional UI
- Smooth transitions

---

## 📁 Project Structure

```
auronexmedia-blog/
├── src/
│   ├── components/          # UI components
│   │   ├── Navbar.tsx      # Navigation
│   │   ├── PostCard.tsx    # Post preview
│   │   ├── RichTextEditor.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── admin/          # Admin panel
│   │   │   ├── Dashboard.tsx
│   │   │   ├── PostCreate.tsx
│   │   │   ├── PostEdit.tsx
│   │   │   └── ...
│   │   └── public/         # Public pages
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client
│   │   ├── utils.ts        # Helpers
│   │   └── storage.ts      # Image upload
│   ├── store/              # State management
│   └── types/              # TypeScript types
├── supabase-schema.sql     # Database schema
├── fix-categories-tags.sql # Fix categories
├── verify-categories-tags.js
└── SETUP_GUIDE.md          # Detailed guide
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **State**: Zustand
- **Editor**: TipTap
- **Routing**: React Router v6

---

## 📊 Categories & Tags

### Categories (10)
- Business, Finance, SaaS, Startups, AI, Reviews
- Technology, Marketing, Productivity, Leadership

### Tags (50+)
- Technology: JavaScript, React, TypeScript, Python...
- Business: Entrepreneurship, Strategy, Growth...
- Finance: Investing, Cryptocurrency, Fintech...
- AI/ML: Machine Learning, ChatGPT, Automation...
- Marketing: SEO, Content Marketing, Social Media...

**Need to fix categories?** Run `fix-categories-tags.sql` in Supabase SQL Editor.

---

## 🔧 Common Tasks

### Fix Categories/Tags
```bash
# 1. Open Supabase SQL Editor
# 2. Copy content from fix-categories-tags.sql
# 3. Run it
# 4. Verify:
node verify-categories-tags.js
```

### Test Supabase Connection
```bash
node test-supabase-connection.js
```

### Import HTML Article (Fastest!)
1. Go to `/admin/posts/import`
2. Drag & drop HTML file
3. Review AI suggestions
4. Click "Publish Now"
5. Done! ⚡

### Create New Post (Manual)
1. Go to `/admin/posts/new`
2. Fill in title, content, category
3. Add 3-5 tags
4. Choose status (draft/published)
5. Click "Create Post"

### Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```
Add environment variables in Vercel dashboard.

---

## 🎨 Customization

### Change Brand Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#137a3c',  // Your color
}
```

### Update Logo
Edit `src/components/Navbar.tsx`:
```jsx
<span>Your</span>
<span>Brand</span>
```

### Add New Category
1. Go to Supabase SQL Editor
2. Run:
```sql
INSERT INTO categories (name, slug, description) 
VALUES ('Category Name', 'category-slug', 'Description');
```

---

## 🐛 Troubleshooting

### Categories not showing?
```bash
# Run fix script
node verify-categories-tags.js
# Then run fix-categories-tags.sql in Supabase
```

### Can't connect to Supabase?
1. Check `.env` file has correct credentials
2. Verify Supabase project is active
3. Run: `node test-supabase-connection.js`

### Build errors?
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### More help?
See `SETUP_GUIDE.md` for detailed troubleshooting.

---

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Netlify
1. Push to GitHub
2. Import in Netlify
3. Add environment variables
4. Deploy!

**Important**: Update Supabase Auth URLs after deployment in Supabase Dashboard → Authentication → URL Configuration.

---

## 📚 Documentation

- **QUICK_START_HTML_IMPORT.md** - 60-second guide to HTML import
- **HTML_IMPORT_GUIDE.md** - Complete HTML import documentation
- **SETUP_GUIDE.md** - Complete setup and troubleshooting guide
- **supabase-schema.sql** - Database schema
- **fix-categories-tags.sql** - Fix categories and tags
- **sample-article.html** - Test HTML file for import feature

---

## 🔒 Security

✅ Row Level Security enabled  
✅ Public can only view published posts  
✅ Admins have full access  
✅ Secure authentication  
✅ SQL injection prevention  
✅ XSS protection  

---

## 📄 License

MIT License - feel free to use for your projects!

---

## 🙏 Credits

Built with:
- [Supabase](https://supabase.com) - Backend
- [React](https://react.dev) - Frontend
- [TailwindCSS](https://tailwindcss.com) - Styling
- [TipTap](https://tiptap.dev) - Editor

---

**Built with ❤️ by a senior full-stack developer**

Need help? Check `SETUP_GUIDE.md` or open an issue!
