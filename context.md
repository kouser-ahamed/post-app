# Engineering Architecture & System Context: PostPulse

## 1. Executive Summary

**PostPulse** is a responsive, high-performance community publishing web application built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **DaisyUI**. It provides users with full CRUD control to browse, search, paginate, inspect, create, edit, and delete community posts.

The application communicates with the public **DummyJSON API** (`https://dummyjson.com/posts`) as its remote data source. This document details the technical evolution, architecture patterns, core problem-solving strategies, and production readiness of the refactored system.

---

## 2. Architecture Evolution

### 2.1 Initial State vs. Current Clean Architecture

| Dimension | Initial State (Legacy) | Current Clean Architecture |
| :--- | :--- | :--- |
| **Component Model** | Monolithic components (`PostList.tsx`, `PostDetails.tsx`) mixing data fetching, form handling, validation, and rendering | **Pure Presentational Components** strictly separated from container views and business hooks |
| **Server State** | Raw, manual `useEffect` loops with `useState`, `AbortController`, and manual error tracking | **TanStack Query (`@tanstack/react-query`)** managing caching, deduping, background synchronization, and mutations |
| **Separation of Concerns** | Mixed: UI components invoked `fetch` directly with ad-hoc payloads and inline validations | **Layered Architecture**: `api/` (transport) $\to$ `hooks/` (server/client state) $\to$ `views/` (containers) $\to$ `components/` (pure UI) |
| **Form & Validation** | Ad-hoc inline state checking before API dispatch; no central contracts | **Dedicated Schema Layer (`src/schemas/postSchema.ts`)** with reusable, testable validation pure functions |
| **Modals & Dialogs** | Native browser alerts or deeply nested dialog DOM with scroll clipping | Custom reusable `Modal` wrapper (`max-w-2xl`), accessible Escape handling, centered delete confirm modal |

### 2.2 Why This Refactor Was Done

1. **Separation of Concerns (SoC)**: Presentation code is decoupled from business logic and network protocols. UI components can be developed, tested, and styled in isolation.
2. **Reusability & Modularity**: Fine-grained atomic components (`PostTags`, `PostReactions`, `PostDetailsHeader`, `PostDetailsBody`, `PostFormFields`) eliminate copy-paste code across cards, details, and modals.
3. **Predictable Caching & Single Source of Truth**: TanStack Query acts as a reactive caching engine across views. Creating, editing, or deleting a post updates both the master list and active post details instantly without jarring reload loops.
4. **Resilience & Scalability**: Centralized error boundaries, schema validation, and structured API layers create an architecture that scales smoothly as new features are added.

---

## 3. Key Technical Implementations & Problem-Solving

### 3.1 Server State & DummyJSON Mock Limitation
* **The Problem**: DummyJSON simulates data creation by returning mock IDs (e.g., `id: 151` or client timestamps). However, because DummyJSON does not persist records to a live database, subsequent `PATCH /posts/:id` or `DELETE /posts/:id` requests targeting newly created mock IDs return `404 Not Found`. In a naive frontend implementation, this breaks the UI with unhandled exceptions.
* **The Solution**: 
  - `postsApi.ts` implements resilient try/catch handling that intercepts simulated 404 responses gracefully, synthesizing an optimistic fallback response with current timestamps and merged payloads.
  - `usePostMutations.ts` intercepts TanStack Query callbacks:
    - **Create**: Inserts the newly created post at the head of `POSTS_QUERY_KEY` and initializes its detail cache via `setQueryData`.
    - **Update**: Merges modified attributes into the existing cached entry without network round-trip bottlenecks.
    - **Delete**: Cleans up both list and detail query keys immediately.

### 3.2 Search & Pagination Strategy
* **Debounced Search**: A dedicated search input with a 350ms debounce window avoids unnecessary re-renders and computation on every keystroke.
* **Pagination (9 cards per page)**: 
  - Posts are organized with a fixed limit of 9 cards per page.
  - Search queries filter across title, body, and category tags simultaneously.
  - Changing query parameters automatically resets the active page to `1` without unexpected page resets during standard browsing.
  - Reusable `Pagination` component renders dynamic sliding pagination window numbers with graceful ellipsis (`...`).

### 3.3 Form Validation Layer
* Located in `src/schemas/postSchema.ts`.
* Enforces validation constraints before triggering network mutations:
  - **Title**: Required, minimum 3 characters.
  - **Body**: Required, minimum 5 characters.
  - **Tags**: Robust comma-delimited parser stripping `#` symbols, empty tokens, and leading/trailing whitespace.
* Pure validation logic allows zero-cost unit testability and keeps form components lightweight.

### 3.4 Custom Modals & Dialog Architecture
* **Native Alert Elimination**: Eliminated disruptive browser `alert()` and `confirm()` popups. Replaced with custom, centered accessible dialogs.
* **Modal Component (`src/components/common/Modal.tsx`)**:
  - Implements keyboard accessibility (`Escape` key support) and backdrop click dismissal.
  - Set to a spacious `max-w-2xl` width for create and edit forms, eliminating internal vertical scrollbars and clipping issues.
  - `DeleteConfirmModal`: Centered, warning-accented modal with distinct "Cancel" and "Delete" actions.

### 3.5 UI/UX Enhancements
* **Tag Cleaning**: Removed all `#` prefixes across cards, details, and forms. Tags are rendered cleanly as structured pill badges.
* **Tag Relocation**: In compliance with design directives, tags are placed strictly below the body paragraph rather than beside or above it.
* **Identifier Modernization**: Removed `#` from metadata counters (e.g., converted `#91` $\to$ `User 91`, `#16` $\to$ `Author 16`, `#3` $\to$ `Post ID 3`).
* **Global Scrollbar Suppression**: Tailored CSS in `src/index.css` hides ugly native browser scrollbars globally across Chrome, Firefox, Safari, and Edge while preserving natural mouse wheel and touch momentum scrolling.

### 3.6 Environment Configuration
* Hardcoded API URLs were completely decoupled from the codebase.
* `.env` declares `VITE_API_BASE_URL=https://dummyjson.com`.
* `src/api/client.ts` dynamically parses `import.meta.env.VITE_API_BASE_URL` with a reliable fallback to `https://dummyjson.com`, supporting staging, development, and production endpoints seamlessly.

---

## 4. File Structure Overview

```
src/
├── api/
│   ├── client.ts             # Generic fetch wrapper reading VITE_API_BASE_URL with query parameter handling
│   └── postsApi.ts           # Post domain network operations with resilient 404 mock ID fallbacks
├── schemas/
│   └── postSchema.ts         # Validation rules (Title min 3, Body min 5) & tag string sanitization
├── types/
│   └── index.ts              # Core TypeScript interfaces (Post, Payloads, Reactions, Form errors)
├── hooks/
│   ├── usePosts.ts           # Master list query, debounced search logic, and pagination state
│   ├── usePost.ts            # Single post query with instant cache prefill from list data
│   └── usePostMutations.ts   # Create, Update, and Delete mutations with cache updates
├── components/
│   ├── common/               # Atomic reusable primitives
│   │   ├── Button.tsx        # Styled button with variants, sizes, and loading spinners
│   │   ├── Modal.tsx         # Accessible overlay modal (max-w-2xl, no internal scrollbars)
│   │   ├── Pagination.tsx    # Responsive page selector with ellipsis logic
│   │   └── Skeleton.tsx      # Pulse placeholder skeleton loader for cards
│   ├── posts/
│   │   ├── PostCard/
│   │   │   ├── PostCard.tsx       # Presentational card container
│   │   │   ├── PostTags.tsx       # Sanitized tag pills placed below content
│   │   │   └── PostReactions.tsx  # Likes, dislikes, views, and author stats
│   │   ├── PostDetails/
│   │   │   ├── PostDetailsHeader.tsx # Navigation and Edit/Delete action bar
│   │   │   └── PostDetailsBody.tsx   # Detailed post display with reaction grid
│   │   ├── PostForm/
│   │   │   └── PostFormFields.tsx # Pure form input fields with validation error feedback
│   │   └── Modals/
│   │       ├── CreatePostModal.tsx   # Form modal to add new posts
│   │       ├── EditPostModal.tsx     # Form modal to update existing posts
│   │       └── DeleteConfirmModal.tsx# Centered confirmation dialog
│   └── Navbar.tsx            # Sticky header brand navigation
├── views/
│   ├── PostsView.tsx         # Community posts view container wiring hooks to components
│   └── PostDetailsView.tsx   # Single post details container wiring mutations to components
├── App.tsx                   # Top-level view router and responsive layout container
├── main.tsx                  # Application bootstrap with QueryClientProvider setup
└── index.css                 # Tailwind CSS v4, DaisyUI, and global scrollbar concealment
```

---

## 5. Business Value & Readiness

1. **Production-Ready Maintainability**:
   - Every file has a single, well-defined responsibility.
   - Any API or design system update requires changes in only one isolated file without touching presentational UI components.
2. **Zero-Flake Performance**:
   - TanStack Query eliminates redundant network calls via memory caching (`staleTime: 5 mins`).
   - Debounced search prevents network and CPU throttling.
3. **Seamless Developer Onboarding**:
   - Strict TypeScript typings eliminate runtime shape ambiguities.
   - The standardized folder structure follows modern React enterprise conventions.
4. **Lint & Build Stability**:
   - The application compiles cleanly with zero TypeScript errors and passes strict ESLint checks.
