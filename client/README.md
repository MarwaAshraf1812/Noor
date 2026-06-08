
# Noor Client 🌙

The frontend web application for Noor—an interactive, gamified Islamic tracking application designed for children. Built using **React, Vite, and Tailwind CSS**, this client offers fluid, kid-friendly animations (via **Framer Motion**) and real-time level/achievement notifications (via **Socket.io-client**).

---

## 🛠 Tech Stack & Tools

*   **Runtime/Build Tool:** [Vite](https://vite.dev/) (React + ES6+)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/) (For floating gems, progress transitions, and modals)
*   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Lightweight, reactive client-side store)
*   **Real-time Connection:** [Socket.io-client](https://socket.io/docs/v4/client-api/)
*   **HTTP Client:** [Axios](https://axios-http.com/) (Configured with `withCredentials: true` to support HTTP-Only auth cookies)

---

## 📂 Recommended Directory Structure

This represents the clean structure for the frontend client:

```text
client/
├── public/
│   └── sounds/             # Sound effects (e.g., gem collect, level-up sound)
├── src/
│   ├── assets/             # Images, static icons, SVG assets
│   ├── components/         # Reusable UI atoms (Buttons, InputFields, Spinner, Badges)
│   │   ├── GemCounter.jsx  # Floating gem status/total display
│   │   ├── LevelProgress.jsx # Circular or horizontal XP/level tracker
│   │   └── Modal.jsx       # Custom animated modals for achievements
│   ├── hooks/              # Custom React hooks (e.g. useSocket, useGeolocation)
│   ├── layouts/            # Navigation structures (DashboardLayout, AuthLayout)
│   ├── pages/              # Main app pages
│   │   ├── Auth.jsx        # Login & Registration views
│   │   ├── Dashboard.jsx   # Today's progress overview
│   │   ├── PrayerGrid.jsx  # Weekly 5x7 prayer tracking grid
│   │   ├── Quran.jsx       # Memorization/Revision input loggers
│   │   ├── Tasbih.jsx      # Interactive electronic clicker counter
│   │   └── Adhkar.jsx      # Checklist for Morning, Evening, and Sleep azkar
│   ├── services/           # API integration (Axios client, endpoints mapping)
│   │   └── api.js          # Shared Axios instance
│   ├── store/              # Zustand global stores
│   │   └── userStore.js    # Syncs user info, levels, and gems wallet state
│   ├── App.jsx             # Main Router & Route Guard setup
│   ├── index.css           # Global CSS and custom Tailwind classes
│   └── main.jsx            # React root mount entry point
├── tailwind.config.js      # Theme customizations (colors, font-families, animations)
├── vite.config.js          # Vite config & API dev server proxy configuration
└── package.json            # Client-side scripts and dependencies
```

---

## 🚀 Key Client Modules

### 1. Interactive Tasbih Clicker
*   A large, touch-optimized button that counts up to `33`.
*   Includes subtle haptic feedback (using the HTML5 Vibration API on mobile) and sound effects on completion.
*   Once a session is submitted, it updates the database via `/api/v1/tasbih/session` and animates a gem collection modal.

### 2. Prayer Tracker Grid
*   A beautifully formatted 5x7 grid showing the current week's prayers (Saturday to Friday).
*   Allows the user to click any day/prayer slot to open a selection modal (Mosque, Congregation, Home, Missed).
*   Requests the user's location via geolocation APIs to validate "Mosque" status and earn higher points.

### 3. Floating Gem & Level Up Animations
*   Uses `Framer Motion` to orchestrate floating gem animations whenever an activity is logged.
*   Listens to real-time events from Socket.io (server-triggered on level threshold cross) to display a celebratory fullscreen **Level Up** animation.

---

## 🔌 API Integration Guidelines

Ensure all Axios instances are created with:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true, // Crucial: forces browser to attach HTTP-Only JWT cookies
});

export default api;
```

---

## 🚀 Getting Started

### 1. Installation
Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

### 2. Environment Variables
Create a `.env` file in the client directory:
```env
VITE_API_URL="http://localhost:8000/api/v1"
VITE_SOCKET_URL="http://localhost:8000"
```

### 3. Development Server
Run the local dev server:
```bash
npm run dev
```

### 4. Build for Production
Build the static assets:
```bash
npm run build
```
The optimized static bundle will be exported to the `dist/` directory, ready to be served by Nginx or static file hosts.
