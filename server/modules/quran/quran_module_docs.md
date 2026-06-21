# Noor - Quran Module Documentation & User Flow

## Overview
The **Quran Module** is a core component of the Noor application. It encourages and tracks children's daily Quran reading, revision, and memorization (Hifz) habits through a gamified experience. It calculates points/gems, tracks activity streaks, and manages daily goals.

---

## Features Implemented
1. **Local Data Caching**: Quranic data is cached locally via `quranData.json` for rapid UI rendering without relying on external APIs.
2. **Session Logging (Hifz & Revision)**: Records the surah name, number of verses, type of session, and the date.
3. **Daily Goals & Progress Tracking**: Users can set custom targets for Hifz and Revision. Progress is calculated in real-time.
4. **Gamification Engine Integration**:
   - Awards gems per verse memorized/revised.
   - Provides fixed session bonuses.
   - Grants a **Goal Bonus** when a daily target is successfully met.
   - Dynamically updates the user's overall level and specific "Quran Streak".
5. **Dashboard Analytics**: Exposes detailed metrics to feed the UI, including today's progress percentages, weekly active days, total lifetime memorized verses, and current Surah progress.

---

## 🛣️ User Flow (Journey)

### Flow 1: Opening the Quran Dashboard
1. The user navigates to the **Quran** section in the app.
2. The UI calls `GET /api/v1/quran/dashboard`.
3. **Backend Action**:
   - Calculates today's Hifz and Revision percentages based on the user's custom daily targets.
   - Computes total lifetime verses memorized (e.g., "1000 آية").
   - Identifies the user's current Quran streak.
   - Computes the weekly activity graph (last 7 days).
   - Identifies the current Surah being memorized and calculates remaining ayahs to award the "Surah Crown".
4. The dashboard is populated with personalized metrics.

### Flow 2: Setting a Daily Goal
1. The user (or parent) wants to change the default daily goals.
2. The UI calls `PUT /api/v1/quran/targets` with the new targets.
3. **Backend Action**:
   - Updates `daily_hifz_target` and/or `daily_revision_target` in the database.
4. Future analytics and bonuses are calculated against this new target.

### Flow 3: Logging a Quran Session
1. The user completes memorizing or revising a set of verses and clicks **"حفظت آية"** or **"تسجيل مراجعة"**.
2. The UI calls `POST /api/v1/quran/session` with `surah_name`, `verse_count`, and `type`.
3. **Backend Action**:
   - Validates the verse count against the actual number of ayahs in the specified Surah.
   - Calculates base points using `POINTS_CONFIG`.
   - Checks if the user reached 100% of their daily goal; if so, awards the `GOAL_BONUS`.
   - Opens a database transaction (`$transaction`):
     - Saves the session.
     - Updates total gems and checks for a Level Up.
     - Updates the Activity Streak.
4. The response includes a congratulatory message, gems earned, level up status, and goal completion status to display an animated popup on the frontend.

---

## 📡 API Endpoints

### 1. Update Daily Targets
- **Endpoint**: `PUT /api/v1/quran/targets`
- **Description**: Updates the user's custom goals.
- **Body**: 
  ```json
  {
    "daily_hifz_target": 10,
    "daily_revision_target": 20
  }
  ```

### 2. Submit Quran Session
- **Endpoint**: `POST /api/v1/quran/session`
- **Description**: Logs a new session and awards points.
- **Body**:
  ```json
  {
    "surah_name": "Al-Faatiha",
    "verse_count": 5,
    "type": "HIFZ" // or "REVISION"
  }
  ```
- **Response**: Details on gems earned, level ups, streak, and success message.

### 3. Fetch Quran Dashboard Analytics
- **Endpoint**: `GET /api/v1/quran/dashboard`
- **Description**: Returns all aggregated data required for the Quran section UI.
- **Response**: Contains `todayHifz`, `todayRevision`, `totalHifz`, `streak`, `weeklyActivity`, `history`, and `currentSurah`.
