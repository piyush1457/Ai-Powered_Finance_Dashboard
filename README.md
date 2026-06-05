# Proton Finance — Wealth Curator Dashboard

An AI-powered personal finance and wealth management dashboard designed for modern wealth curation. This application is built using a React + Vite stack paired with React Native Web for cross-platform layout support.

---

## 🚀 Deployment Links
* **GitHub Repository**: [GitHub Link Placeholder] *(e.g., https://github.com/username/ai-powered-finance-dashboard)*
* **Live Deployed App**: [Vercel / Netlify Link Placeholder] *(e.g., https://proton-finance-wealth-curator.vercel.app)*

---

## 🏛️ Architectural Decisions

1. **Vite Bundler**:
   * Chosen for sub-second hot module reloading (HMR), treeshaking, and highly optimized Rolldown production building.
2. **React Native Web Layout Primitives**:
   * Uses cross-platform primitives (`View`, `Text`, `Pressable`, `StyleSheet` from `react-native-web`) combined with custom CSS token design systems. This enables writing code once with a future-proof path to target iOS, Android, or mobile applications.
3. **Client-Side Routing via React Router v7 (`react-router-dom`)**:
   * Provides declarative routing, code splitting, parameter passing (e.g., global search keywords query sync), and page layouts structure.
4. **Context-Driven Global State System**:
   * Uses context providers (`ThemeContext`, `ToastContext`) to coordinate global states like light/dark mode styles, toast notifications, active alerts counts, and system configurations.
5. **Client-Side Storage Engine (LocalStorage Mock Database)**:
   * Keeps mock data interactive (e.g., simulating initial balances, adjusting budget caps, removing bank integrations, dismissing alerts) by initializing and synchronizing data via `localStorage`.

---

## ⚓ Custom Hooks Explanation

* **[`useFetch`](file:///c:/Users/piyus/Desktop/Assignment/AI-Powered%20Finance%20Dashboard%20(Personal%20Finance)/src/hooks/useFetch.js)**:
  * Manages AJAX/fetch states (`data`, `loading`, `error`, `refetch`).
  * Features a built-in loading delay simulator and falls back automatically to a localized `localStorage` object initialized from mock records if no database URL is provided.
* **[`useLocalStorage`](file:///c:/Users/piyus/Desktop/Assignment/AI-Powered%20Finance%20Dashboard%20(Personal%20Finance)/src/hooks/useLocalStorage.js)**:
  * Reads and persists state key-value pairs inside the browser's `localStorage` API, keeping settings and flags synchronized across reloads.
* **[`useAnalytics`](file:///c:/Users/piyus/Desktop/Assignment/AI-Powered%20Finance%20Dashboard%20(Personal%20Finance)/src/hooks/useAnalytics.js)**:
  * Wraps user actions (such as downloading CSV logs, upgrading tiers, adjusting budgets) and logs standard data-layer events. In development mode, prints styled, color-coded logging markers.
* **[`useDebounce`](file:///c:/Users/piyus/Desktop/Assignment/AI-Powered%20Finance%20Dashboard%20(Personal%20Finance)/src/hooks/useDebounce.js)**:
  * Delays reactive triggers on rapid keystrokes (e.g., searching transactions), preventing duplicate calculations or DOM paint choke points.

---

## ⚡ Performance Optimizations

1. **Route-Level Code Splitting**:
   * Page files (Dashboard, Accounts, Budgets, Insights, Transactions) are wrapped in `React.lazy()` and rendered within a `Suspense` wrapper. Users only download files required for their active page view.
2. **Skeleton Screen Fallbacks**:
   * Replaced raw text loading messages (`Loading Budgets...`) with custom pulsating layout skeletons that match the component layout structure, reducing layout shifts and improving perceived loading speeds.
3. **Recalculation Memoization**:
   * Uses `React.memo` for static grid items and list items (such as `CategoryCard`) to prevent re-renders on page state modifications.
   * Employs `useMemo` to filter performance graph data according to the selected timeframe tab, avoiding redundant array slicing on high-frequency changes.
4. **Numeric Native Styling**:
   * Replaced string style coordinates (e.g., `padding: '10px 14px'`) with split numeric properties (`paddingVertical: 10`, `paddingHorizontal: 14`) to prevent CSS parsing engine errors in the React Native Web layer.

---

## 🔍 SEO Techniques Used

1. **Dynamic Metadata & Document Head Control**:
   * Uses `react-helmet-async` on all views (e.g., [Dashboard.jsx](file:///c:/Users/piyus/Desktop/Assignment/AI-Powered%20Finance%20Dashboard%20(Personal%20Finance)/src/pages/Dashboard.jsx), [Budgets.jsx](file:///c:/Users/piyus/Desktop/Assignment/AI-Powered%20Finance%20Dashboard%20(Personal%20Finance)/src/pages/Budgets.jsx)) to specify descriptive title tags, meta descriptions, and OpenGraph parameters.
2. **Semantic Element Rendering**:
   * Web layout features semantic elements (like standard `<header>`, `<nav>`, and `<main>` tags) to aid screen readers and search crawlers in indexation.
3. **Heading Hierarchy**:
   * Standardizes a single `h1` element per view, cascading into subheadings (`h2`, `h3`, `h4`) sequentially.
4. **Accessible Elements & IDs**:
   * Interactive components, links, and search items include descriptive `accessibilityLabel` tags and unique `testID` markers.

---

## ⚖️ Trade-offs

1. **React Native Web Layouts**:
   * *Pros*: Enables clean compile targets for physical mobile apps in React Native.
   * *Cons*: CSS animations and custom selectors (like hover states, media queries, CSS gradients) must be simulated or wrapped in custom styles since traditional stylesheet hooks aren't directly available.
2. **LocalStorage Syncing vs Backend DB**:
   * *Pros*: Zero server deployment cost, runs offline, instantaneous transactions simulator.
   * *Cons*: User modifications do not persist across different browser types, devices, or clearing storage cache, limiting multi-user capabilities.
3. **Recharts Charts**:
   * *Pros*: Clean, interactive SVG graphs with responsive container capabilities.
   * *Cons*: Not natively compatible with React Native canvas; on native mobile apps, this will need to be ported to library equivalents like `react-native-svg-charts`.

---

## 🛠️ Installation & Verification

To run this application locally:

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

---

## 🚀 Quick Deployment Guide

### Vercel Deployment
1. Install the Vercel CLI globally or use the [Vercel Dashboard](https://vercel.com).
2. Run `vercel` in the project root:
   ```bash
   vercel
   ```
3. Accept the default configuration (Vite project configuration will automatically be detected).
4. Run `vercel --prod` to deploy to production.

### Netlify Deployment
1. Create a `netlify.toml` file in the root directory:
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
2. Import the repository into Netlify or use the Netlify CLI to deploy:
   ```bash
   netlify deploy --prod
   ```
