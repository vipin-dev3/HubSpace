# HubSpace — Central Link Hub & Bookmark Directory 🚀

**HubSpace** is a sleek, highly responsive, glassmorphic link dashboard and bookmark directory web application built with **React**, **Vite**, and **Tailwind CSS**. It organizes, searches, and accesses categorized web links with zero latency, client-side persistence, and one-click data backup.

![HubSpace Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Features

- **⚡ Zero-Latency Instant Search**: Powered by **Fuse.js** across bookmark titles, URLs, descriptions, tags, and category names.
- **⭐ Quick Dock & Favorites**: Pin favorite links for 1-click launch from a sticky top dock.
- **🏷️ Dynamic Filtering**: Filter links via category tabs or click any `#tag` badge to isolate matching tools.
- **👁️ 3 Versatile Views**:
  - **Detailed Cards**: Glassmorphic cards with full descriptions, tag chips, and action bars.
  - **Compact Grid**: High-density view for quick scanning.
  - **List View**: Dense tabular rows with direct links and visit counters.
- **🌐 Auto Favicon Previews**: Uses high-resolution domain favicons (`https://www.google.com/s2/favicons?domain=...&sz=64`) with smooth SVG fallbacks.
- **🌓 Dark & Light Modes**: Default dark mode with glowing border accents and smooth transitions.
- **💾 LocalStorage Persistence**: Add, edit, pin, or delete links directly from the UI with zero server setup.
- **📦 Data Backup & Restore**: Export bookmarks to `.json` and import/merge external link collections anytime.
- **⌨️ Keyboard Shortcuts**:
  - `/` or `Ctrl + K`: Focus search bar instantly
  - `Escape`: Clear search and close active filters
  - `Alt + N`: Open "+ Add Link" modal

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern component-driven UI architecture |
| **Vite** | Lightning-fast development server & optimized production bundler |
| **Tailwind CSS** | Custom glassmorphism, glowing borders, and dark/light color palette |
| **Lucide React** | Consistent, lightweight vector icon toolkit |
| **Framer Motion** | Smooth modal transitions, accordion animations, and dock micro-interactions |
| **Fuse.js** | Fuzzy client-side search engine |

---

## 📁 Project Structure

```
my-list/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── CategoryIcon.jsx     # Dynamic category Lucide icon mapper
│   │   │   ├── FaviconImage.jsx     # Auto-fetching favicon with fallback
│   │   │   └── Toast.jsx            # Animated toast notification queue
│   │   ├── dashboard/
│   │   │   ├── EmptyState.jsx       # Fallback UI for zero search results
│   │   │   ├── FilterBar.jsx        # Category pills, tag indicator & accordion toggles
│   │   │   ├── Header.jsx           # Global search, theme switcher & action bar
│   │   │   ├── QuickDock.jsx        # Sticky top launchpad for pinned bookmarks
│   │   │   └── StatsOverview.jsx    # Metric counters (Total, Pinned, Visits)
│   │   ├── links/
│   │   │   ├── CategorySection.jsx  # Collapsible accordion & responsive grid
│   │   │   ├── LinkCardDetailed.jsx # Full-featured glassmorphic bookmark card
│   │   │   ├── LinkCardCompact.jsx  # Minimalist high-density grid item
│   │   │   └── LinkRowList.jsx      # Dense row list item
│   │   └── modals/
│   │       ├── AddEditLinkModal.jsx # Add/Edit modal with live URL favicon preview
│   │       ├── ConfirmDeleteModal.jsx # Safe deletion prompt
│   │       └── ImportExportModal.jsx# Backup / JSON import manager
│   ├── context/
│   │   ├── LinksContext.jsx         # Global bookmark state & LocalStorage sync
│   │   └── ThemeContext.jsx         # Dark / Light mode provider
│   ├── data/
│   │   └── linksData.js             # Initial categorized seed links & metadata
│   ├── hooks/
│   │   └── useKeyboardShortcuts.js  # Global keyboard listener
│   ├── utils/
│   │   └── urlHelper.js             # Domain extraction & URL sanitation
│   ├── App.jsx                      # Main app shell & ambient glows
│   ├── index.css                    # Tailwind setup & glassmorphism classes
│   └── main.jsx                     # Root mounting with Context Providers
├── index.html                       # HTML template with Google Fonts
├── tailwind.config.js               # Theme extensions and glass styling
├── postcss.config.js                # PostCSS configuration
├── vite.config.js                   # Vite bundler configuration
└── package.json                     # Dependencies & scripts
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js `v18+` or `v20+`
- npm or pnpm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/your-username/hubspace.git
cd hubspace
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173` to explore HubSpace!

### 3. Build for Production
```bash
npm run build
```
The optimized static build will be generated in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deployment Instructions

### Deploy to Vercel (Recommended)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import this repository. Vercel will automatically detect **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Your app is live in seconds with automatic SSL and global CDN.

### Deploy to Netlify
1. Log in to [Netlify](https://www.netlify.com/) and click **"Add new site"** -> **"Import an existing project"**.
2. Connect your Git provider.
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy Site**.

### Deploy to GitHub Pages
1. In `vite.config.js`, set `base`:
   ```javascript
   export default defineConfig({
     base: '/<REPO_NAME>/',
     plugins: [react()],
   })
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy the `dist` folder via `gh-pages` or GitHub Actions workflow.

---

## 💾 Data Format (Import / Export)

HubSpace allows seamless exporting and importing of links in standard JSON format:

```json
{
  "version": "1.0",
  "exportedAt": "2026-10-22T04:00:00.000Z",
  "categories": [
    {
      "id": "ai-ml",
      "name": "AI & Machine Learning",
      "icon": "Sparkles",
      "color": "purple"
    }
  ],
  "links": [
    {
      "id": "link-1",
      "title": "ChatGPT",
      "url": "https://chatgpt.com",
      "description": "OpenAI conversational assistant for code debugging.",
      "categoryId": "ai-ml",
      "tags": ["AI", "LLM"],
      "isPinned": true,
      "clickCount": 142
    }
  ]
}
```

---

## 📄 License
MIT License. Free to use, modify, and distribute for personal or commercial projects.
