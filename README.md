# PostPulse 📰

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://post-app-nine-hazel.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> **PostPulse** is a modern, responsive Community Post Management web application built with React, TypeScript, and Tailwind CSS. It connects to the [DummyJSON Posts API](https://dummyjson.com/posts) to offer full CRUD capabilities, instant client-side updates, live search, and pagination.

🔗 **Live Application**: [https://post-app-nine-hazel.vercel.app/](https://post-app-nine-hazel.vercel.app/)

---

## ✨ Key Features

- **Full CRUD Functionality**:
  - **Browse**: Real-time post feed with view counts, likes, and dislikes.
  - **Create Post**: Full-sized modal with Title, Body, and comma-separated Tags.
  - **Edit Post**: Pre-filled update modal with instant master state synchronization.
  - **Delete Post**: Custom confirmation modal (accessible, zero native browser popups).
  - **Resilient Fallback**: Gracefully handles DummyJSON's simulated IDs (404 errors) with seamless local state persistence.
- **Search & Filter**:
  - Live search bar integrated directly within the Community Posts header section.
  - Debounced input for smooth, lag-free querying across titles, descriptions, and tags.
- **Pagination**:
  - Displays exactly 9 post cards per page (`limit: 9`).
  - Clean pagination bar with Previous, Next, and numbered page controls.
- **Thoughtful UI / UX**:
  - Modern typography and clean layout with subtle shadows and card hover lifts.
  - Clean tag badges positioned beneath post descriptions without unwanted `#` prefixes.
  - Uncluttered user/author identifiers (e.g., `User 91`, `Author 16`).
  - Wide, comfortable modal windows (`max-w-2xl`) with no internal scrollbars.
  - Hidden cross-browser scrollbars while maintaining full touch and momentum scrolling.
- **Responsive Design**:
  - Mobile-first approach tailored for mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Frontend Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/) (`hi`, `ri`) |
| **Bundler & Tooling** | [Vite](https://vitejs.dev/), ESLint |
| **Data Source** | [DummyJSON Posts API](https://dummyjson.com/posts) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```text
post-app/
├── public/               # Static assets
├── src/
│   ├── components/
│   │   ├── Navbar.tsx       # Header with branding
│   │   ├── PostCard.tsx     # Individual responsive post card
│   │   ├── PostDetails.tsx  # Detailed view with Edit & Delete modals
│   │   └── PostList.tsx     # Post grid, search bar, Create modal & pagination
│   ├── services/
│   │   └── api.ts           # Centralized API service with 404 resilience
│   ├── types.ts             # TypeScript interfaces and data models
│   ├── App.tsx              # Master state management and view routing
│   ├── main.tsx             # React DOM entry point
│   └── index.css            # Global styling, Tailwind imports, scrollbar reset
├── index.html               # HTML template, metadata & brand favicon
├── package.json             # Dependencies and scripts
└── vite.config.ts           # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (version 18 or newer) and `npm` installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kouser-ahamed/post-app.git
   cd post-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173` to view the application.

### Available Scripts

- `npm run dev` - Starts the development server with Hot Module Replacement (HMR).
- `npm run build` - Type-checks and creates an optimized production bundle in `dist/`.
- `npm run lint` - Runs ESLint to check for code quality and style errors.
- `npm run preview` - Previews the production build locally.

---

## 🌐 Deployment

This application is deployed on **Vercel** with automatic preview and production deployments.

- **Production URL**: [https://post-app-nine-hazel.vercel.app/](https://post-app-nine-hazel.vercel.app/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Created by **Kouser Ahamed**  
- GitHub: [@kouser-ahamed](https://github.com/kouser-ahamed)
