# Noor - Tasbih Module Documentation & User Flow

## Overview
The **Tasbih Module** is designed to allow children to count and track their daily Tasbih loop cycles (e.g. saying "سبحان الله", "الحمد لله", "الله أكبر"). It tracks their progress, updates their streaks, and rewards them with gems upon loop completion.

---

## Features Implemented
1. **Unconstrained Repeats**: Children can complete multiple Tasbih sessions/loops daily without any duplicate checks or limits.
2. **Session Logging (`logTasbihSession`)**: Logs completed (or partial/in-progress) sessions with the specific phrase name, target count, and completion state.
3. **Gamification & Rewards**:
   - Uses `POINTS_CONFIG.TASBIH` to award gems: Completing a session/loop rewards `COMPLETED_SESSION` points (10 points = 10 gems).
   - Dynamically processes gems and level-ups via unified database transactions.
   - Updates the child's `TASBIH` activity streak.
4. **Dashboard Analytics**: Groups today's completed Tasbih loops and returns the accumulated sum of counts for each phrase (e.g. "سبحان الله": 66, "الحمد لله": 15) to feed the progress rings on the frontend dashboard.

---

## 🛣️ User Flow (Journey)

### Flow 1: Counting Tasbih
1. The child navigates to the **"تسبيح"** (Tasbih) section.
2. They select a phrase (e.g., `"سبحان الله"`) and a target (e.g., `33` times).
3. The child taps the circular counter to count.
4. When they hit `33/33` (completion), a popup card appears on the screen (e.g., "أحسنت! قلت سبحان الله 33 مرة 🎉").
5. The frontend calls `POST /api/v1/tasbih/session` with the details.
6. **Backend Action**:
   - Records the completed session.
   - Adds 10 gems to the child's profile and checks for a Level Up.
   - Increments or updates the `TASBIH` activity streak.
7. The response provides the gems earned, current streak, and level-up info for the popup animation.

### Flow 2: Checking Dashboard Progress (يومي)
1. The child opens the **"يومي"** (Daily) dashboard.
2. The frontend calls `GET /api/v1/tasbih/dashboard` alongside other daily endpoint requests.
3. **Backend Action**:
   - Calculates the sum of counts completed today for the four main phrases: "سبحان الله", "الحمد لله", "الله أكبر", and "سبحان الله وبحمده".
   - Retrieves the current Tasbih streak.
4. The dashboard displays the counts (e.g. `1/33` for الحمد لله) in the "هيا بنا نجمع حسنات بالذكر!" widget.

---

## 📡 API Endpoints

### 1. Log Tasbih Session
- **Endpoint**: `POST /api/v1/tasbih/session`
- **Body**:
  ```json
  {
    "tasbih_name": "سبحان الله", // Name of the dhikr
    "tasbih_count": 33,        // Number of times counted
    "completed": true         // Whether the loop target was achieved
  }
  ```
- **Response**:
  ```json
  {
    "message": "أحسنت يا بطل! أكملت تسبيح سبحان الله بنجاح 🎉",
    "gemsEarned": 10,
    "totalGems": 60,
    "currentLevel": 1,
    "isLevelUp": false,
    "tasbihStreak": 2
  }
  ```

### 2. Get Tasbih Dashboard Analytics
- **Endpoint**: `GET /api/v1/tasbih/dashboard`
- **Response**:
  ```json
  {
    "todayProgress": {
      "سبحان الله": 66,
      "الحمد لله": 15,
      "الله أكبر": 0,
      "سبحان الله وبحمده": 0
    },
    "streak": 2
  }
  ```
