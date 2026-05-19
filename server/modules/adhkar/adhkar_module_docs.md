# Noor - Adhkar Module Documentation & User Flow

## Overview
The **Adhkar Module** enables children to complete and track daily Morning, Evening, and Sleep Adhkar sessions. It integrates directly with the Noor gamification and streak tracking systems.

---

## Features Implemented
1. **API Seeding & Local Caching**: Dynamically retrieves authentic Adhkar from the Nawaf Alqari API and seeds them to `adhkarData.json`.
2. **Structure Flattening (`flattenAdhkar`)**: Automatically flattens multi-layered nested arrays in the API response (e.g. grouped Surahs like Ayat Al-Kursi, Al-Ikhlas) into a clean, flat list of cards to prevent frontend mapping crashes.
3. **Session Logging (`logAdhkarSession`)**: Logs daily completions for `MORNING`, `NIGHT` (Evening), and `SLEEP` categories.
4. **Gamification & Rewards**:
   - Automatically awards gems based on `POINTS_CONFIG` (Morning = 15, Evening = 15, Sleep = 10).
   - Updates level and total gems atomically via Prisma transactions.
   - Automatically maintains the child's `ADHKAR` activity streak.
5. **Dashboard Analytics**: Retrieves today's completed categories (`MORNING`, `NIGHT`, `SLEEP`) and current streak.

---

## 🛣️ User Flow (Journey)

### Flow 1: Viewing Adhkar List
1. The child clicks on the **"الأذكار"** (Adhkar) section.
2. The frontend calls `GET /api/v1/adhkar/category/:category` (e.g., `MORNING`).
3. **Backend Action**:
   - Translates English Category (e.g., `MORNING`) to Arabic (`أذكار الصباح`).
   - Retrieves the flattened card list from local cached data.
4. The child views cards for each dhikr showing the text, count, and description.

### Flow 2: Completing a Session
1. The child finishes reciting and clicks **"تم القراءة"** (Done).
2. The frontend calls `POST /api/v1/adhkar/session` with `{ "category": "MORNING" }`.
3. **Backend Action**:
   - Checks if the user already logged this category today.
   - Retrieves reward points from `POINTS_CONFIG`.
   - Starts a database transaction:
     - Marks progress as completed.
     - Adds gems to user's profile and checks for level up.
     - Increments the user's `ADHKAR` streak.
4. The response returns the success message, gems earned, new level/levelUp status, and current streak to show in a congratulations popup.

### Flow 3: Checking Daily Progress Dashboard
1. The child opens the main dashboard or Adhkar progress screen.
2. The frontend calls `GET /api/v1/adhkar/dashboard`.
3. **Backend Action**:
   - Aggregates today's completions for Morning, Evening, and Sleep.
   - Retrieves the user's current Adhkar streak.
4. The child sees a visual progress check (e.g., Morning: Checked, Evening/Sleep: Unchecked) and their current streak.

---

## 📡 API Endpoints

### 1. Get Adhkar Cards
- **Endpoint**: `GET /api/v1/adhkar/category/:category`
- **Path Param**: `category` (one of: `MORNING`, `NIGHT`, `SLEEP`)
- **Response**: List of Adhkar items:
  ```json
  [
    {
      "category": "أذكار الصباح",
      "count": "1",
      "description": "",
      "reference": "",
      "content": "أَصْـبَحْنا وَأَصْـبَحَ المُـلْكُ لله..."
    }
  ]
  ```

### 2. Log Adhkar Completion
- **Endpoint**: `POST /api/v1/adhkar/session`
- **Body**:
  ```json
  {
    "category": "MORNING" // MORNING, NIGHT, or SLEEP
  }
  ```
- **Response**:
  ```json
  {
    "message": "تقبل الله طاعتك يا بطل! تم تسجيل الأذكار بنجاح 🎉",
    "gemsEarned": 15,
    "totalGems": 150,
    "currentLevel": 2,
    "isLevelUp": true,
    "adhkarStreak": 5
  }
  ```

### 3. Get Adhkar Dashboard Analytics
- **Endpoint**: `GET /api/v1/adhkar/dashboard`
- **Response**:
  ```json
  {
    "todayStatus": {
      "MORNING": true,
      "NIGHT": false,
      "SLEEP": false
    },
    "streak": 5
  }
  ```
